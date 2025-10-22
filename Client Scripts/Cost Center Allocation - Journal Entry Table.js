

// The cost center in journal entries table will automatically be allocated based on the user selection in the form.




frappe.ui.form.on("Journal Entry Account", {
    cost_center: function(frm, cdt, cdn) {
        // Optional safeguard: if user has only one permitted Cost Center
        frappe.db.get_value("User Permission", 
            { user: frappe.session.user, allow: "Cost Center" }, 
            "for_value", 
            function(r) {
                if (r && r.for_value) {
                    frappe.model.set_value(cdt, cdn, "cost_center", r.for_value);
                }
            }
        );
    },
    account: function(frm, cdt, cdn) {
        // Auto set cost center when user selects an account
        frappe.db.get_value("User Permission", 
            { user: frappe.session.user, allow: "Cost Center" }, 
            "for_value", 
            function(r) {
                if (r && r.for_value) {
                    frappe.model.set_value(cdt, cdn, "cost_center", r.for_value);
                }
            }
        );
    }
});

frappe.ui.form.on("Journal Entry", {
    onload: function(frm) {
        // Auto set cost center for existing rows
        frappe.db.get_value("User Permission", 
            { user: frappe.session.user, allow: "Cost Center" }, 
            "for_value", 
            function(r) {
                if (r && r.for_value) {
                    frm.doc.accounts.forEach(row => {
                        if (!row.cost_center) {
                            frappe.model.set_value(row.doctype, row.name, "cost_center", r.for_value);
                        }
                    });
                }
            }
        );
    }
});


frappe.ui.form.on('Journal Entry Account', {
	refresh(frm) {
		// your code here
	}
})