/* ============================================================
   Tutorial library. Each entry = one guided walkthrough.
   `steps` drives the guide engine; entries without steps show as
   "Coming soon" cards in the library (the structure scales to many).

   The guide chrome is a TWO-LEVEL rail (faithful to the real Send to
   Amazon flow): primary milestones with branch sub-steps hanging below.
   Step fields:
     mkey      milestone key — which rail node this step lives under
     sub       optional sub-step code (e.g. "1a") → renders a branch pill
     subLabel  label for that sub pill
     chip      brand eyebrow shown on the coach card
     target    data-tour selector to spotlight ('' = centered intro)
     side      preferred coach side: right|left|top|bottom|center
     title,body,tip
     action    'click' (advance when the highlighted control is clicked)
               | 'next' (advance with the coach Next button)
     pre()     set app state so the target is visible — must be robust to
               being entered out of order (free navigation / jump-to-step)
     onNext()  optional: run when advancing a 'next' step
   ============================================================ */
(function () {
  const A = window.App;

  /* Put the live console into a given wizard state. Robust to jump-in:
     ensures two SKUs are selected, the wizard exists, quantities are set,
     and the requested steps are marked done. */
  function wz(openStep, done, extra) {
    A.state.menuOpen = false;
    A.state.menuExpand = null;
    A.state.groupOpen = false;
    if (!A.state.selected.size) { A.state.selected.add(0); A.state.selected.add(1); }
    A.state.page = "sendfc";
    if (!A.state.wizard) A.initWizard();
    const w = A.state.wizard;
    w.qty[w.skus[0]] = w.qty[w.skus[0]] || 20;
    w.qty[w.skus[1]] = w.qty[w.skus[1]] || 20;
    w.ready = w.ready || {};
    w.ready[w.skus[0]] = true;
    w.ready[w.skus[1]] = true;
    w.activeTab = "all";
    w.done = {};
    (done || []).forEach(s => { w.done[s] = true; });
    if (extra && extra.placement) w.placement = w.placement || "optimized";
    w.openStep = openStep;
    if (!(extra && extra.keepModal)) A.closeModal();
    A.render();
  }
  function openPacking() { A.actions["wf-packing"]({ el: { dataset: { i: String(A.state.wizard.skus[0]) } } }); }
  function openBoxes() { A.actions["wf-boxes"]({ el: { dataset: { n: String(A.D.SHIPMENTS[0].n) } } }); }

  window.TUTORIALS = {
    "shipping-plan": {
      id: "shipping-plan",
      title: "Create an FBA Shipping Plan",
      category: "Shipments",
      level: "Core workflow",
      summary: "Select inventory, set quantities, choose placement, print labels and add tracking — the full Send to Amazon flow end to end.",
      est: "6–8 min",
      rail: {
        order: ["start", "1", "2", "3", "4", "done"],
        label: { start: "Start", "1": "Choose inventory", "2": "Confirm shipping", "3": "Print labels", "4": "Confirm carrier", done: "Done" },
        glyph: { start: "\u25B8", done: "\u2713" },
      },
      steps: [
        /* ---------------- START ---------------- */
        {
          mkey: "start", chip: "FBABEE · Guided tutorial", target: "", side: "center",
          pre: () => { A.reset(); A.render(); },
          title: "Create an FBA Shipping Plan",
          body: "We'll send inventory into the fulfillment network — from picking products to entering tracking. Follow the highlighted control, or click outside the spotlight any time to explore the console freely.",
          tip: "This is a safe sandbox. Nothing here affects a real account.",
          action: "next",
        },
        {
          mkey: "start", chip: "Start · Navigation", target: ".burger", side: "right",
          pre: () => { A.state.page = "home"; A.state.menuOpen = false; A.render(); },
          title: "Open the main menu",
          body: "Everything starts from the menu. Click the menu icon in the top-left.",
          action: "click",
        },
        {
          mkey: "start", chip: "Start · Navigation", target: '[data-sec="inventory"]', side: "right",
          pre: () => { A.state.page = "home"; A.state.menuOpen = true; A.state.menuExpand = null; A.render(); },
          title: "Open Inventory",
          body: "Expand the <b>Inventory</b> section to reveal your fulfillment tools.",
          action: "click",
        },
        {
          mkey: "start", chip: "Start · Navigation", target: '.sm-link[data-page="inventory"]', side: "right",
          pre: () => { A.state.page = "home"; A.state.menuOpen = true; A.state.menuExpand = "inventory"; A.render(); },
          title: "Open FBA Inventory",
          body: "Click <b>FBA Inventory</b> — where every in-network product lives.",
          action: "click",
        },
        {
          mkey: "start", chip: "Start · FBA Inventory", target: '[data-tour="ck-0"]', side: "right",
          pre: () => { A.state.menuOpen = false; A.state.menuExpand = null; A.state.page = "inventory"; A.render(); },
          title: "Pick your first product",
          body: "Tick the checkbox next to a product you want to ship.",
          tip: "You can ship several SKUs in one plan — select as many as you need.",
          action: "click",
        },
        {
          mkey: "start", chip: "Start · FBA Inventory", target: '[data-tour="ck-1"]', side: "right",
          pre: () => { A.state.menuOpen = false; A.state.page = "inventory"; A.state.selected.add(0); A.render(); },
          title: "Add a second product",
          body: "Select another SKU too, so we build a plan with two products.",
          action: "click",
        },
        {
          mkey: "start", chip: "Start · FBA Inventory", target: '[data-tour="group-action"]', side: "top",
          pre: () => { A.state.menuOpen = false; A.state.page = "inventory"; A.state.selected.add(0); A.state.selected.add(1); A.state.groupOpen = false; A.render(); },
          title: "Open group actions",
          body: "With products selected, an action bar appears at the bottom. Click <b>Select group action</b>.",
          action: "click",
        },
        {
          mkey: "start", chip: "Start · FBA Inventory", target: '[data-tour="send-fba"]', side: "top",
          pre: () => { A.state.menuOpen = false; A.state.page = "inventory"; A.state.selected.add(0); A.state.selected.add(1); A.state.groupOpen = true; A.render(); },
          title: "Send to FBA",
          body: "Choose <b>Send to FBA</b> to start a shipping plan with your selected products.",
          action: "click",
        },

        /* ---------------- 1 · CHOOSE INVENTORY ---------------- */
        {
          mkey: "1", sub: "1a", subLabel: "Choose inventory", chip: "Step 1a · Choose inventory",
          target: '[data-tour="qty-0"]', side: "left",
          pre: () => { wz(1, []); A.state.wizard.ready = {}; A.render(); },
          title: "Set the boxes to send",
          body: "Enter how many <b>boxes</b> to send for the first SKU. The <b>Units</b> field fills in automatically — units = boxes × units per box.",
          tip: "When boxes are set, a green <b>Confirm to send</b> button appears. Confirming locks the SKU and moves it to the <b>SKUs ready to send</b> tab.",
          action: "next",
          onNext: () => { const w = A.state.wizard; if (!(+w.qty[w.skus[0]] > 0)) w.qty[w.skus[0]] = 20; w.ready[w.skus[0]] = true; A.render(); },
        },
        {
          mkey: "1", sub: "1a", chip: "Step 1a · Choose inventory",
          target: '[data-tour="qty-1"]', side: "left",
          pre: () => { wz(1, []); A.state.wizard.ready = { [A.state.wizard.skus[0]]: true }; A.render(); },
          title: "Boxes for the second SKU",
          body: "Do the same for the second product — set its <b>boxes</b> and the units calculate automatically, then confirm it to send.",
          action: "next",
          onNext: () => { const w = A.state.wizard; if (!(+w.qty[w.skus[1]] > 0)) w.qty[w.skus[1]] = 20; w.ready[w.skus[1]] = true; A.render(); },
        },
        {
          mkey: "1", sub: "1b", subLabel: "Packing details", chip: "Step 1b · Packing details",
          target: '[data-tour="pack-upb"]', side: "right",
          pre: () => { wz(1, []); openPacking(); },
          title: "Enter packing details",
          body: "Open packing details for each SKU and fill in <b>units per box</b>, dimensions and weight. Amazon uses this to calculate boxes and fees.",
          tip: "Use the real carton measurements — not estimates.",
          action: "next",
        },
        {
          mkey: "1", sub: "1b", chip: "Step 1 · Choose inventory",
          target: '[data-tour="confirm-step1"]', side: "top",
          pre: () => wz(1, []),
          title: "Confirm and continue",
          body: "Your inventory is ready. Click <b>Confirm and continue</b> to move on to shipping.",
          action: "click",
        },

        /* ---------------- 2 · CONFIRM SHIPPING ---------------- */
        {
          mkey: "2", chip: "Step 2 · Confirm shipping",
          target: '[data-tour="mode-own"]', side: "bottom",
          pre: () => wz(2, [1]),
          title: "Choose how you'll ship",
          body: "Select your shipping mode. We'll <b>use your own carrier</b> for this plan.",
          action: "click",
        },
        {
          mkey: "2", chip: "Step 2 · Confirm shipping",
          target: '[data-tour="placement-optimized"]', side: "top",
          pre: () => { wz(2, [1]); A.state.wizard.shipMode = "own"; A.render(); },
          title: "Pick a placement option",
          body: "Compare cost and splits, then choose <b>Optimized split</b> — the lowest-cost option.",
          tip: "Fewer splits can mean higher placement fees. Optimized balances both.",
          action: "click",
        },
        {
          mkey: "2", chip: "Step 2 · Confirm shipping",
          target: '[data-tour="confirm-step2"]', side: "top",
          pre: () => wz(2, [1], { placement: true }),
          title: "Confirm shipping destinations",
          body: "This generates a shipment to each fulfillment center. Click <b>Confirm shipping destinations</b>.",
          action: "click",
        },

        /* ---------------- 3 · PRINT LABELS ---------------- */
        {
          mkey: "3", sub: "3a", subLabel: "Box labels", chip: "Step 3a · Print box labels",
          target: '[data-tour="print-labels"]', side: "left",
          pre: () => wz(3, [1, 2], { placement: true }),
          title: "Print your box labels",
          body: "Pick a label format and click <b>Print</b> for each shipment, one destination at a time. Only box labels print here — pallet labels come later.",
          tip: "A box label only works for its own shipment. Never mix labels between destinations.",
          action: "next",
        },
        {
          mkey: "3", sub: "3b", subLabel: "Box contents", chip: "Step 3b · Box contents",
          target: '[data-tour="box-weight"]', side: "right",
          pre: () => { wz(3, [1, 2], { placement: true }); openBoxes(); },
          title: "Check each box's data",
          body: "Open <b>View or edit contents</b> to review every box's weight, dimensions and quantity against your real cartons, then validate.",
          tip: "Wrong carton data slows receiving and skews your cost estimate.",
          action: "next",
        },
        {
          mkey: "3", sub: "3b", chip: "Step 3 · Print labels",
          target: '[data-tour="continue-step3"]', side: "top",
          pre: () => wz(3, [1, 2], { placement: true }),
          title: "Continue to carrier info",
          body: "Once labels are printed and boxes packed, click <b>Continue to carrier and pallet information</b>.",
          action: "click",
        },

        /* ---------------- 4 · CONFIRM CARRIER ---------------- */
        {
          mkey: "4", chip: "Step 4 · Carrier & freight",
          target: '[data-tour="confirm-step4"]', side: "top",
          pre: () => wz(4, [1, 2, 3], { placement: true }),
          title: "Confirm carrier & freight",
          body: "Review the carrier, delivery window and pallet count for each shipment, then click <b>Confirm shipment information</b>.",
          tip: "The pallet count must match what actually ships — your carrier needs it for the appointment.",
          action: "click",
        },

        /* ---------------- DONE · TRACKING ---------------- */
        {
          mkey: "done", chip: "Final step · Tracking",
          target: '[data-tour="save-tracking"]', side: "top",
          pre: () => wz(5, [1, 2, 3, 4], { placement: true }),
          title: "Add tracking and finish",
          body: "Enter your PRO / freight bill number, then click <b>Save</b> to complete the plan.",
          tip: "Your BOL must carry the Amazon Reference ID, box & pallet counts, and the PRO number.",
          action: "click",
        },
      ],
    },

    // ---- Library placeholders (structure scales; build these next) ----
    "manage-shipments": { id: "manage-shipments", title: "Track & Manage Shipments", category: "Shipments", level: "Core workflow", summary: "Find a shipment in the queue, read its status, and work an in-progress shipment to completion.", est: "4 min", soon: true },
    "fix-stranded": { id: "fix-stranded", title: "Fix Stranded Inventory", category: "Inventory", level: "Problem solving", summary: "Locate stranded listings and relist them so units become sellable again.", est: "3 min", soon: true },
    "create-removal": { id: "create-removal", title: "Create a Removal Order", category: "Inventory", level: "Core workflow", summary: "Return or dispose of FBA inventory and track the removal through to completion.", est: "4 min", soon: true },
    "send-to-awd": { id: "send-to-awd", title: "Send Inventory to AWD", category: "Storage", level: "Core workflow", summary: "Move bulk inventory into low-cost warehousing and set up auto-replenishment to FBA.", est: "5 min", soon: true },
    "restock": { id: "restock", title: "Restock Recommendations", category: "Inventory", level: "Growth", summary: "Read restock suggestions and turn them into a shipping plan in a couple of clicks.", est: "4 min", soon: true },
  };
})();
