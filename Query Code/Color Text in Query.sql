-- the following is just a sample which is used in SQL SELECTion.

CASE
        WHEN (CAST(sii.qty AS SIGNED) - CAST(IFNULL(dq.total_delivered_qty, 0) AS SIGNED)) > IFNULL(aq.available_qty, 0)
            THEN CONCAT('<span style="color:red; font-weight:bold;">', si.name, '</span>')
        ELSE si.name
    END AS "Sales Invoice:HTML:150",

SELECT pe.name AS "Payment Entry:Link/Payment Entry:200", pe.posting_date AS "Posting Date:Date:120", pe.payment_type AS "Payment Type:Data:120", pe.paid_amount AS "Paid Amount:Currency:200", pe.received_amount AS "Received Amount:Currency:200", pe.party_type AS "Party Type:Data:120", pe.party AS "Party:Dynamic Link/Party Type:150", pe.mode_of_payment AS "Mode of Payment:Data:180", pe.cost_center AS "Cost Center:180" FROM tabPayment Entry pe WHERE pe.posting_date BETWEEN %(from_date)s AND %(to_date)s AND (%(payment_type)s = '' OR pe.payment_type = %(payment_type)s) ORDER BY pe.posting_date DESC, pe.name DESC;