/* ============================================================
   Library placeholders — "Coming soon" cards (no `steps`). As each is built,
   move it into its own console/tutorials/<id>.js with real steps and drop it
   from here. Requires console/tutorials/_shared.js (loaded first).
   ============================================================ */
(function () {
  [
    { id: "create-awd-shipping-plan", title: "Create an AWD Shipping Plan", category: "Shipments", level: "Core workflow", summary: "Create an AWD shipment plan and prepare inventory for Amazon Warehousing and Distribution.", est: "8–10 min", soon: true, libraryOrder: 9 },
    { id: "fill-tracking-ids", title: "Fill out Tracking IDs", category: "Shipments", level: "Shipment details", summary: "Enter or update tracking IDs for your shipments in Seller Central.", est: "3 min", soon: true, libraryOrder: 5 },
    { id: "download-sku-list-box-ids", title: "Download the SKU List with Box IDs", category: "Shipments", level: "Shipment files", summary: "Download the SKU list or pack list with Box IDs to help ensure accurate carton labeling.", est: "3 min", soon: true, libraryOrder: 6 },
    { id: "delete-shipping-plan", title: "Delete a Shipping Plan", category: "Shipments", level: "Problem solving", summary: "Delete an unwanted or incorrect shipping plan.", est: "2 min", soon: true, libraryOrder: 7 },
    { id: "check-draft-shipping-plans", title: "Check Draft Shipping Plans", category: "Shipments", level: "Shipment management", summary: "Find and review draft shipping plans that have not been completed yet.", est: "3 min", soon: true, libraryOrder: 8 },
  ].forEach(window.TutorialKit.register);
})();
