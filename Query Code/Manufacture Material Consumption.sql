-- Raw Material Consumptions - Percentage Calculation based on Work Order Required Quantity and Actual Consumption.

SELECT
    se.name AS "stock_entry",
    se.posting_date AS "posting_date",
    se.work_order AS "work_order",
    wo.production_item AS "finished_item",
    sei.item_code AS "item_code",
    item.item_name AS "item_name",
    woi.required_qty AS "required_qty",
    SUM(sei.qty) AS "consumed_qty",
    (SUM(sei.qty) - woi.required_qty) AS "difference",
    CASE 
        WHEN woi.required_qty > 0 THEN 
            ROUND(((SUM(sei.qty) - woi.required_qty) / woi.required_qty) * 100, 2)
        ELSE 0
    END AS "variance_percent"
FROM
    `tabStock Entry` se
INNER JOIN 
    `tabStock Entry Detail` sei ON sei.parent = se.name
LEFT JOIN 
    `tabWork Order` wo ON wo.name = se.work_order
LEFT JOIN 
    `tabWork Order Item` woi ON woi.parent = wo.name AND woi.item_code = sei.item_code
LEFT JOIN 
    `tabItem` item ON item.name = sei.item_code
WHERE
    se.docstatus = 1
    AND se.purpose = 'Manufacture'
GROUP BY
    se.name, sei.item_code
ORDER BY
    se.posting_date DESC, se.name;
