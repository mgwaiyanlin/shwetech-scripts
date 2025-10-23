

// The cost center in purchase order table will automatically be allocated based on the user selection in the form.

frappe.ui.form.on("Purchase Order", {
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
        // Keep item cost centers in sync after refresh
        if (frm.doc.cost_center) {
            frm.trigger("cost_center");
        }
    }
});

frappe.ui.form.on("Purchase Order Item", {
    items_add: function(frm, cdt, cdn) {
        // Assign parent cost center when a new item is added
        if (frm.doc.cost_center) {
            frappe.model.set_value(cdt, cdn, "cost_center", frm.doc.cost_center);
        }
    }
});


frappe.ui.form.on('Purchase Order Item', {
	refresh(frm) {
		// your code here
	}
})
