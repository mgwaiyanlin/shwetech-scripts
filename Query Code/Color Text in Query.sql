-- the following is just a sample which is used in SQL SELECTion.

CASE
        WHEN (CAST(sii.qty AS SIGNED) - CAST(IFNULL(dq.total_delivered_qty, 0) AS SIGNED)) > IFNULL(aq.available_qty, 0)
            THEN CONCAT('<span style="color:red; font-weight:bold;">', si.name, '</span>')
        ELSE si.name
    END AS "Sales Invoice:HTML:150",

