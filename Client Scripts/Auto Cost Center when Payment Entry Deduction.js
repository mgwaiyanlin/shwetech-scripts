// Client Script
// DocType: Payment Entry

// Handle child table events
frappe.ui.form.on('Payment Entry Deduction', {
    account: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.cost_center) return;

        // Priority 1: parent Payment Entry cost_center
        if (frm.doc.cost_center) {
            frappe.model.set_value(cdt, cdn, 'cost_center', frm.doc.cost_center);
            return;
        }

        // Priority 2: fetch from Account (check possible fields)
        if (row.account) {
            const try_fields = ['cost_center', 'default_cost_center'];
            frappe.db.get_value('Account', row.account, try_fields)
            .then(r => {
                const msg = r && r.message ? r.message : null;
                if (msg) {
                    const cc = try_fields.map(f => msg[f]).find(Boolean);
                    if (cc) frappe.model.set_value(cdt, cdn, 'cost_center', cc);
                }
            });
        }
    }
});

// Handle parent Payment Entry events
frappe.ui.form.on('Payment Entry', {
    refresh: function(frm) {
        set_deduction_cost_centers(frm);
    },
    cost_center: function(frm) {
        set_deduction_cost_centers(frm);
    },
    deductions_add: function(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        if (!row.cost_center && frm.doc.cost_center) {
            frappe.model.set_value(cdt, cdn, 'cost_center', frm.doc.cost_center);
        }
    },
    validate: function(frm) {
        // Ensure cost center is filled before save validation
        (frm.doc.deductions || []).forEach(function(row) {
            if (!row.cost_center) {
                if (frm.doc.cost_center) {
                    frappe.model.set_value(row.doctype, row.name, 'cost_center', frm.doc.cost_center);
                } else if (row.account) {
                    frappe.db.get_value('Account', row.account, ['cost_center','default_cost_center'])
                    .then(r => {
                        if (r && r.message) {
                            const cc = r.message.cost_center || r.message.default_cost_center;
                            if (cc) frappe.model.set_value(row.doctype, row.name, 'cost_center', cc);
                        }
                    });
                }
            }
        });
    }
});

// Helper function
function set_deduction_cost_centers(frm) {
    (frm.doc.deductions || []).forEach(function(row) {
        if (row.cost_center) return;
        if (frm.doc.cost_center) {
            frappe.model.set_value(row.doctype, row.name, 'cost_center', frm.doc.cost_center);
        } else if (row.account) {
            frappe.db.get_value('Account', row.account, ['cost_center','default_cost_center'])
            .then(r => {
                if (r && r.message) {
                    const cc = r.message.cost_center || r.message.default_cost_center;
                    if (cc) frappe.model.set_value(row.doctype, row.name, 'cost_center', cc);
                }
            });
        }
    });
}
