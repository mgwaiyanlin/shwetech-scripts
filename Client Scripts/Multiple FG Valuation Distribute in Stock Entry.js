// In the stock entry using Disassemble, multiple finished item can be created and the raw items' valuations will also be distributed proportionally.
// Pre-requised -> Customize Stock Entry Detail -> add Is Finished Good and Is Scrap Item Confirm Checkboxes.

frappe.ui.form.on("Stock Entry", {
    validate: function(frm) {
        const purpose = frm.doc.purpose;

        // --- Apply valuation logic for all types ---
        if (["Manufacture", "Disassemble", "Material Receipt", "Material Issue", "Material Transfer"].includes(purpose)) {

            let total_rm_value = 0;
            let finished_goods = [];
            let scrap_items = [];

            frm.doc.items.forEach(d => {
                if (d.custom_is_finished_good) {
                    finished_goods.push(d);
                } else if (d.custom_is_scrap_item_confirm) {
                    scrap_items.push(d);
                } else {
                    // --- Raw Materials ---
                    total_rm_value += (d.basic_rate || 0) * (d.qty || 0);

                    // --- Source Warehouse check ---
                    if (!d.s_warehouse && !["Material Receipt"].includes(purpose)) {
                        frappe.throw(__("Please select Source Warehouse for raw material: {0}", [d.item_code]));
                    }

                    // --- Remove Target Warehouse only for Manufacture or Disassemble ---
                    if (["Manufacture", "Disassemble"].includes(purpose) && d.t_warehouse) {
                        frappe.model.set_value(d.doctype, d.name, "t_warehouse", null);
                    }
                }
            });

            // --- Allocation logic ---
            if (finished_goods.length > 0 && total_rm_value > 0) {
                let total_fg_qty = finished_goods.reduce((sum, fg) => sum + (fg.qty || 0), 0);
                if (total_fg_qty <= 0) {
                    frappe.throw(__("Total finished goods quantity cannot be zero."));
                }

                finished_goods.forEach(fg => {
                    let share_ratio = (fg.qty || 0) / total_fg_qty;
                    let allocated_value = total_rm_value * share_ratio;
                    let new_rate = allocated_value / (fg.qty || 1);

                    frappe.model.set_value(fg.doctype, fg.name, "basic_rate", new_rate);

                    // --- Target Warehouse check ---
                    if (!fg.t_warehouse && purpose !== "Material Issue") {
                        frappe.throw(__("Please select Target Warehouse for finished good: {0}", [fg.item_code]));
                    }

                    // --- Remove Source Warehouse for finished goods ---
                    if (["Manufacture", "Disassemble"].includes(purpose) && fg.s_warehouse) {
                        frappe.model.set_value(fg.doctype, fg.name, "s_warehouse", null);
                    }
                });

                // --- Scrap items valuation = 0 ---
                scrap_items.forEach(scrap => {
                    frappe.model.set_value(scrap.doctype, scrap.name, "basic_rate", 0);

                    if (!scrap.t_warehouse && purpose !== "Material Issue") {
                        frappe.throw(__("Please select Target Warehouse for scrap item: {0}", [scrap.item_code]));
                    }

                    if (["Manufacture", "Disassemble"].includes(purpose) && scrap.s_warehouse) {
                        frappe.model.set_value(scrap.doctype, scrap.name, "s_warehouse", null);
                    }
                });

                frappe.msgprint(__("Valuation split among finished goods. Scrap items set to zero value."));
            }
        }
    }
});


frappe.ui.form.on('Stock Entry Detail', {
	refresh(frm) {
		// your code here
	}
})

frappe.ui.form.on('Stock Entry Detail', {
	refresh(frm) {
		// your code here
	}
})