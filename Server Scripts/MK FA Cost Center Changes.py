# Loop through all Asset Movement Items in 'assets' child table
for row in doc.assets:
    if row.custom_to_asset_category or row.custom_to_cost_center:
        asset = frappe.get_doc("Asset", row.asset)

        # Allow updating submitted Asset
        asset.flags.ignore_validate_update_after_submit = True
        asset.flags.ignore_validate = True

        # --- Update Asset Category ---
        if row.custom_to_asset_category:
            asset.asset_category = row.custom_to_asset_category

        # --- Update Cost Center ---
        if row.custom_to_cost_center:
            asset.cost_center = row.custom_to_cost_center

        # Save Asset
        asset.save()
