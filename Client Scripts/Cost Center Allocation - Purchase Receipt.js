

// The cost center in purchase receipt item entries table will automatically be allocated based on the user selection in the form.

frappe.ui.form.on("Purchase Receipt", {
    cost_center: function(frm) {
        if (frm.doc.cost_center) {
            // Update cost center for all existing item rows
            (frm.doc.items || []).forEach(row => {
                if (row.cost_center !== frm.doc.cost_center) {
                    frappe.model.set_value(row.doctype, row.name, "cost_center", frm.doc.cost_center);
                }
            });
            frm.refresh_field("items");
        }
    },

    refresh: function(frm) {
        // Reapply cost center on refresh to ensure all rows stay aligned
        if (frm.doc.cost_center) {
            frm.trigger("cost_center");
        }
    }
});

frappe.ui.form.on("Purchase Receipt Item", {
    items_add: function(frm, cdt, cdn) {
        // Set the parent cost center for new item rows
        if (frm.doc.cost_center) {
            frappe.model.set_value(cdt, cdn, "cost_center", frm.doc.cost_center);
        }
    }
});


frappe.ui.form.on('Purchase Receipt Item', {
	refresh(frm) {
		// your code here
	}
})

