frappe.ui.form.on('Sales Order', {
    // This function will run whenever the "Cost Center" field is changed
    cost_center: function(frm) {
        // Condition for the first group of cost centers
        if (frm.doc.cost_center === 'ME - Shop 1 (MDY) - M&B' || frm.doc.cost_center === 'ME - Main Store (MDY) - M&B') {
            frm.set_value('naming_series', 'ME-ORD-.MM.YYYY.-');
        } 
        // Condition for the second cost center
        else if (frm.doc.cost_center === 'Best of Me (MDY) - M&B') {
            frm.set_value('naming_series', 'BOM-ORD-.MM.YYYY.-');
        } 
        else if (frm.doc.cost_center === 'ME - Shop (YGN) - M&B') {
            frm.set_value('naming_series', 'MEYGN-ORD-.MM.YYYY.-');
        } 
        // Default case: if no specific cost center is matched
        else {
            // You can set a default series here or leave it blank
            frm.set_value('naming_series', '');
        }
    }
});