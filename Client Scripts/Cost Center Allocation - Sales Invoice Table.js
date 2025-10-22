

// The cost center in sales invoice table will automatically be allocated based on the user selection in the form.


frappe.ui.form.on("Sales Invoice", {
    cost_center: function(frm) {
        if (frm.doc.cost_center) {
            frm.doc.items.forEach(function(row) {
                frappe.model.set_value(row.doctype, row.name, "cost_center", frm.doc.cost_center);
            });
            frm.refresh_field("items");
        }
    }
});

frappe.ui.form.on("Sales Invoice Item", {
    items_add: function(frm, cdt, cdn) {
        if (frm.doc.cost_center) {
            frappe.model.set_value(cdt, cdn, "cost_center", frm.doc.cost_center);
        }
    }
});
