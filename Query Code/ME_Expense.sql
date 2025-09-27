SELECT
    je.name AS journal_entry,
    je.posting_date,
    je.voucher_type,
    jea.account,
    jea.debit,
    jea.credit,
    jea.cost_center,
    je.remark
FROM
    `tabJournal Entry` je
INNER JOIN
    `tabJournal Entry Account` jea ON je.name = jea.parent
WHERE
    je.docstatus = 1
    AND je.voucher_type IN ('Expense', 'Daily Expense')
ORDER BY
    je.posting_date DESC, je.name;
