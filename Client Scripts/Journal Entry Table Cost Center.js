

// The cost center in account entries table will automatically be allocated based on the user selection.



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

frappe.ui.form.on("Journal Entry Account", {
    accounts_add: function(frm, cdt, cdn) {
        if (frm.doc.custom_cost_center) {
            frappe.model.set_value(cdt, cdn, "cost_center", frm.doc.custom_cost_center);
        }
    }
});

frappe.ui.form.on('Journal Entry Account', {
	refresh(frm) {
		// your code here
	}
})
