# Script Type: DocType Event
# Reference Document Type: Payment Entry
# DocType Event: Before Submit

if doc.payment_type == "Internal Transfer":
    paid = float(doc.paid_amount or 0)
    received = float(doc.received_amount or 0)
    difference = paid - received

    if abs(difference) >= 0.0000001:
        # --- Cost Center Resolution ---
        cc = None
        if doc.cost_center:
            cc = doc.cost_center
        else:
            cc = frappe.db.get_value("Company", doc.company, "cost_center")
        
        # fallback from user permission (if any)
        if not cc:
            cc = frappe.get_all("User Permission",
                filters={"user": frappe.session.user, "allow": "Cost Center"},
                fields=["for_value"],
                limit=1
            )
            if cc:
                cc = cc[0].get("for_value")

        bank_charges_acc = "Bank Charges - M&B"
        exgl_acc = frappe.db.get_value("Company", doc.company, "exchange_gain_loss_account")

        replaced = False
        for d in (doc.get("deductions") or []):
            acc = (d.account or "").strip()
            if (
                (exgl_acc and acc == exgl_acc)
                or ("Exchange Gain" in acc)
                or ("Exchange Loss" in acc)
                or (acc == bank_charges_acc)
            ):
                d.account = bank_charges_acc
                d.cost_center = d.cost_center or cc   # only set if missing
                d.amount = abs(difference)
                replaced = True

        if not replaced:
            doc.append("deductions", {
                "account": bank_charges_acc,
                "cost_center": cc,
                "amount": abs(difference)
            })

        # Deduplication same as before...
        seen = False
        cleaned = []
        for d in (doc.get("deductions") or []):
            if (d.account or "").strip() == bank_charges_acc:
                if not seen:
                    seen = True
                    cleaned.append(d)
            else:
                cleaned.append(d)

        if len(cleaned) != len(doc.get("deductions") or []):
            doc.set("deductions", cleaned)
