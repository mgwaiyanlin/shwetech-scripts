frappe.ui.form.on('Sales Invoice', {
    refresh: function(frm) {
        if (frm.doc.customer) {
            get_customer_outstanding(frm);
        }
    },
    customer: function(frm) {
        if (frm.doc.customer) {
            get_customer_outstanding(frm);
        } else {
            frm.set_value("custom_the_previous_outstanding", 0);
        }
    }
});

function get_customer_outstanding(frm) {
    frappe.call({
        method: "erpnext.accounts.utils.get_balance_on",
        args: {
            party_type: "Customer",
            party: frm.doc.customer,
            date: frappe.datetime.nowdate()
        },
        callback: function(r) {
            if (r.message !== undefined) {
                frm.set_value("custom_the_previous_outstanding", r.message);
            }
        }
    });
}