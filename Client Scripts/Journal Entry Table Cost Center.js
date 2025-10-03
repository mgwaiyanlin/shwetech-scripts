frappe.ui.form.on("Journal Entry", {
    custom_cost_center: function(frm) {
        if (frm.doc.custom_cost_center) {
            frm.doc.accounts.forEach(function(row) {
                frappe.model.set_value(row.doctype, row.name, "cost_center", frm.doc.custom_cost_center);
            });
            frm.refresh_field("accounts");
        }
    }
});


// The cost center in account entries table will automatically be allocated based on the user selection.

