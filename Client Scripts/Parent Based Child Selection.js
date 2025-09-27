frappe.ui.form.on('Item', {
    custom_main_class: function (frm) {
        frm.set_value("custom_sub_category", "");

        if (frm.doc.custom_main_class) {
            frm.set_query("custom_sub_category", function () {
                return {
                    filters: {
                        main_class: frm.doc.custom_main_class
                    }
                };
            });
        } else {
            frm.set_query("custom_sub_category", function () {
                return {
                    filters: {}
                };
            });
        }

        frm.refresh_field("custom_sub_category");
    }
});


