/* ============================================================
   Library placeholders — "Coming soon" cards (no `steps`). As each is built,
   move it into its own console/tutorials/<id>.js with real steps and drop it
   from here. Requires console/tutorials/_shared.js (loaded first).
   ============================================================ */
(function () {
  [
    { id: "manage-shipments", title: "Track & Manage Shipments", category: "Shipments", level: "Core workflow", summary: "Find a shipment in the queue, read its status, and work an in-progress shipment to completion.", est: "4 min", soon: true },
    { id: "fix-stranded", title: "Fix Stranded Inventory", category: "Inventory", level: "Problem solving", summary: "Locate stranded listings and relist them so units become sellable again.", est: "3 min", soon: true },
    { id: "send-to-awd", title: "Send Inventory to AWD", category: "Storage", level: "Core workflow", summary: "Move bulk inventory into low-cost warehousing and set up auto-replenishment to FBA.", est: "5 min", soon: true },
    { id: "restock", title: "Restock Recommendations", category: "Inventory", level: "Growth", summary: "Read restock suggestions and turn them into a shipping plan in a couple of clicks.", est: "4 min", soon: true },
  ].forEach(window.TutorialKit.register);
})();
