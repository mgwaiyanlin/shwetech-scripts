WITH RequiredItems AS (
    SELECT
        wo.name AS work_order,
        wo.production_item AS finished_item_code,
        woi.item_code AS raw_item_code,
        SUM(woi.required_qty) AS required_qty
    FROM
        `tabWork Order` wo
        INNER JOIN `tabWork Order Item` woi ON woi.parent = wo.name
    GROUP BY
        wo.name, wo.production_item, woi.item_code
),

ConsumedItems AS (
    SELECT
        se.name AS stock_entry,
        se.work_order,
        sei.item_code AS raw_item_code,
        SUM(sei.qty) AS consumed_qty
    FROM
        `tabStock Entry` se
        INNER JOIN `tabStock Entry Detail` sei ON sei.parent = se.name
    WHERE
        se.purpose = 'Manufacture'
        AND sei.is_finished_item = 0
        AND IFNULL(sei.is_scrap_item, 0) = 0
    GROUP BY
        se.name, se.work_order, sei.item_code
),

FinishedItems AS (
    SELECT
        se.name AS stock_entry,
        se.work_order,
        sei.item_code AS finished_item_code,
        SUM(sei.qty) AS produced_qty,
        MAX(sei.basic_rate) AS basic_rate,      -- ADDED BASIC RATE
        se.posting_date
    FROM
        `tabStock Entry` se
        INNER JOIN `tabStock Entry Detail` sei ON sei.parent = se.name
    WHERE
        se.purpose = 'Manufacture'
        AND sei.is_finished_item = 1
        /* DATE FILTERS ADDED HERE */
        AND se.posting_date BETWEEN %(from_date)s AND %(to_date)s
    GROUP BY
        se.name, se.work_order, sei.item_code, se.posting_date
),

ScrapItems AS (
    SELECT
        se.name AS stock_entry,
        se.work_order,
        sei.item_code AS scrap_item_code,
        SUM(sei.qty) AS scrap_qty,
        se.posting_date
    FROM
        `tabStock Entry` se
        INNER JOIN `tabStock Entry Detail` sei ON sei.parent = se.name
    WHERE
        se.purpose = 'Manufacture'
        AND sei.is_scrap_item = 1
        AND se.posting_date BETWEEN %(from_date)s AND %(to_date)s
    GROUP BY
        se.name, se.work_order, sei.item_code, se.posting_date
),

MergedItems AS (
    SELECT
        COALESCE(r.work_order, c.work_order) AS work_order,
        COALESCE(r.finished_item_code, f.finished_item_code) AS finished_item_code,
        COALESCE(r.raw_item_code, c.raw_item_code) AS raw_item_code,
        COALESCE(r.required_qty, 0) AS required_qty,
        COALESCE(c.consumed_qty, 0) AS consumed_qty,
        f.stock_entry,
        f.posting_date,
        f.basic_rate,       -- Carry basic rate forward
        CASE 
            WHEN r.raw_item_code IS NULL THEN 'Extra Used (Not in BOM)'
            WHEN c.raw_item_code IS NULL THEN 'Missing Usage (Not Consumed)'
            ELSE 'Matched with BOM'
        END AS status
    FROM
        FinishedItems f
        LEFT JOIN RequiredItems r ON f.work_order = r.work_order
        LEFT JOIN ConsumedItems c 
            ON f.work_order = c.work_order 
            AND r.raw_item_code = c.raw_item_code

    UNION

    SELECT
        c.work_order,
        f.finished_item_code,
        c.raw_item_code,
        0 AS required_qty,
        c.consumed_qty,
        f.stock_entry,
        f.posting_date,
        f.basic_rate,
        'Extra Used (Not in BOM)' AS status
    FROM
        ConsumedItems c
        INNER JOIN FinishedItems f ON f.work_order = c.work_order
    WHERE
        c.raw_item_code NOT IN (
            SELECT raw_item_code FROM RequiredItems WHERE work_order = c.work_order
        )

    UNION

    SELECT
        s.work_order,
        f.finished_item_code,
        s.scrap_item_code AS raw_item_code,
        0 AS required_qty,
        s.scrap_qty AS consumed_qty,
        s.stock_entry,
        s.posting_date,
        f.basic_rate,
        'Scrap Item' AS status
    FROM
        ScrapItems s
        LEFT JOIN FinishedItems f ON f.work_order = s.work_order
)

SELECT
    mi.work_order AS "Work Order:Link/Work Order:200",
    mi.finished_item_code AS "Finished Item:Link/Item:180",
    fi.produced_qty AS "Produced Qty:Float:120",
    fi.basic_rate AS "Basic Rate:Currency:120",       -- DISPLAY BASIC RATE
    mi.stock_entry AS "Stock Entry:Link/Stock Entry:200",
    mi.posting_date AS "Posting Date:Date:120",
    mi.raw_item_code AS "Raw Material:Link/Item:150",
    mi.required_qty AS "Required Qty:Float:120",
    mi.consumed_qty AS "Actual Used Qty:Float:120",
    (mi.consumed_qty - mi.required_qty) AS "Difference:Float:120",
    mi.status AS "Status:Data:250"
FROM
    MergedItems mi
    LEFT JOIN FinishedItems fi ON fi.work_order = mi.work_order
ORDER BY
    mi.work_order,
    mi.finished_item_code,
    FIELD(mi.status, 'Matched with BOM', 'Extra Used (Not in BOM)', 'Missing Usage (Not Consumed)', 'Scrap Item'),
    mi.raw_item_code;
