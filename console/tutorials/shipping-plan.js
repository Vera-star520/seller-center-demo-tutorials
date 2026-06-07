/* ============================================================
   Tutorial: Create an FBA Shipping Plan — the full Send to Amazon flow.
   Requires console/tutorials/_shared.js (loaded first).
   ============================================================ */
(function () {
  const { sendfc, register } = window.TutorialKit;

  register({
    id: "shipping-plan",
    title: "Create an FBA Shipping Plan",
    category: "Shipments",
    level: "Core workflow",
    summary: "Select inventory, set quantities, choose placement, print labels and add tracking — the full Send to Amazon flow end to end.",
    est: "6–8 min",
    rail: {
      order: ["start", "1", "2", "3", "4", "done"],
      label: { start: "Start", "1": "Choose inventory", "2": "Confirm shipping", "3": "Print labels", "4": "Confirm carrier", done: "Done" },
      glyph: { start: "▸", done: "✓" },
    },
    steps: [
      /* ---------------- START ---------------- */
      {
        mkey: "start", chip: "FBABEE · Guided tutorial", target: "", side: "center",
        scenario: { reset: true },
        title: "Create an FBA Shipping Plan",
        body: "We'll send inventory into the fulfillment network — from picking products to entering tracking. Follow the highlighted control, or click outside the spotlight any time to explore the console freely.",
        tip: "This is a safe sandbox. Nothing here affects a real account.",
        action: "next",
      },
      {
        mkey: "start", chip: "Start · Navigation", target: '[data-tour="burger"]', side: "right",
        scenario: { page: "home", menuOpen: false },
        title: "Open the main menu",
        body: "Everything starts from the menu. Click the menu icon in the top-left.",
        action: "click",
      },
      {
        mkey: "start", chip: "Start · Navigation", target: '[data-tour="menu-inventory"]', side: "right",
        scenario: { page: "home", menuOpen: true, menuExpand: null },
        title: "Find Inventory",
        body: "Hover over <b>Inventory</b> — its fulfillment tools slide out to the right.",
        tip: "Sections with an arrow open a sub-menu on hover.",
        action: "next",
      },
      {
        mkey: "start", chip: "Start · Navigation", target: '[data-tour="menu-fba-inventory"]', side: "right",
        scenario: { page: "home", menuOpen: true, menuExpand: "inventory" },
        title: "Open FBA Inventory",
        body: "In the sub-menu, click <b>FBA Inventory</b> — where every in-network product lives.",
        action: "click",
      },
      {
        mkey: "start", chip: "Start · FBA Inventory", target: '[data-tour="ck-0"]', side: "right",
        scenario: { page: "inventory", menuOpen: false, menuExpand: null },
        title: "Pick your first product",
        body: "Tick the checkbox next to a product you want to ship.",
        tip: "You can ship several SKUs in one plan — select as many as you need.",
        action: "click",
      },
      {
        mkey: "start", chip: "Start · FBA Inventory", target: '[data-tour="ck-1"]', side: "right",
        scenario: { page: "inventory", menuOpen: false, selected: [0] },
        title: "Add a second product",
        body: "Select another SKU too, so we build a plan with two products.",
        action: "click",
      },
      {
        mkey: "start", chip: "Start · FBA Inventory", target: '[data-tour="group-action"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [0, 1], groupOpen: false },
        title: "Open group actions",
        body: "With products selected, an action bar appears at the bottom. Click <b>Select group action</b>.",
        action: "click",
      },
      {
        mkey: "start", chip: "Start · FBA Inventory", target: '[data-tour="send-fba"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [0, 1], groupOpen: true },
        title: "Send to FBA",
        body: "Choose <b>Send to FBA</b> to start a shipping plan with your selected products.",
        action: "click",
      },

      /* ---------------- 1 · CHOOSE INVENTORY ---------------- */
      {
        mkey: "1", sub: "1a", subLabel: "Choose inventory", chip: "Step 1a · Choose inventory",
        target: '[data-tour="qty-0"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }),
        title: "Set the boxes to send",
        body: "Enter how many <b>boxes</b> to send for the first SKU. The <b>Units</b> field fills in automatically — units = boxes × units per box.",
        tip: "When boxes are set, a green <b>Confirm to send</b> button appears. Confirming locks the SKU and moves it to the <b>SKUs ready to send</b> tab.",
        action: "next",
      },
      {
        mkey: "1", sub: "1a", chip: "Step 1a · Choose inventory",
        target: '[data-tour="qty-1"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [0] }),
        title: "Boxes for the second SKU",
        body: "Do the same for the second product — set its <b>boxes</b> and the units calculate automatically, then confirm it to send.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", subLabel: "Packing details", chip: "Step 1b · Packing details",
        target: '[data-tour="pack-upb"]', side: "right",
        scenario: sendfc({ openStep: 1, done: [] }, { type: "packing" }),
        title: "Enter packing details",
        body: "Open packing details for each SKU and fill in <b>units per box</b>, dimensions and weight. Amazon uses this to calculate boxes and fees.",
        tip: "Use the real carton measurements — not estimates.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1 · Choose inventory",
        target: '[data-tour="confirm-step1"]', side: "top",
        scenario: sendfc({ openStep: 1, done: [] }),
        title: "Confirm and continue",
        body: "Your inventory is ready. Click <b>Confirm and continue</b> to move on to shipping.",
        action: "click",
      },

      /* ---------------- 2 · CONFIRM SHIPPING ---------------- */
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="mode-own"]', side: "bottom",
        scenario: sendfc({ openStep: 2, done: [1] }),
        title: "Choose how you'll ship",
        body: "Select your shipping mode. We'll <b>use your own carrier</b> for this plan.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="placement-optimized"]', side: "top",
        scenario: sendfc({ openStep: 2, done: [1], shipMode: "own" }),
        title: "Pick a placement option",
        body: "Compare cost and splits, then choose <b>Optimized split</b> — the lowest-cost option.",
        tip: "Fewer splits can mean higher placement fees. Optimized balances both.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="confirm-step2"]', side: "top",
        scenario: sendfc({ openStep: 2, done: [1], placement: "optimized" }),
        title: "Confirm shipping destinations",
        body: "This generates a shipment to each fulfillment center. Click <b>Confirm shipping destinations</b>.",
        action: "click",
      },

      /* ---------------- 3 · PRINT LABELS ---------------- */
      {
        mkey: "3", sub: "3a", subLabel: "Box labels", chip: "Step 3a · Print box labels",
        target: '[data-tour="print-labels"]', side: "left",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "Print your box labels",
        body: "Pick a label format and click <b>Print</b> for each shipment, one destination at a time. Only box labels print here — pallet labels come later.",
        tip: "A box label only works for its own shipment. Never mix labels between destinations.",
        action: "next",
      },
      {
        mkey: "3", sub: "3b", subLabel: "Box contents", chip: "Step 3b · Box contents",
        target: '[data-tour="box-weight"]', side: "right",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }, { type: "boxes" }),
        title: "Check each box's data",
        body: "Open <b>View or edit contents</b> to review every box's weight, dimensions and quantity against your real cartons, then validate.",
        tip: "Wrong carton data slows receiving and skews your cost estimate.",
        action: "next",
      },
      {
        mkey: "3", sub: "3b", chip: "Step 3 · Print labels",
        target: '[data-tour="continue-step3"]', side: "top",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "Continue to carrier info",
        body: "Once labels are printed and boxes packed, click <b>Continue to carrier and pallet information</b>.",
        action: "click",
      },

      /* ---------------- 4 · CONFIRM CARRIER ---------------- */
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="confirm-step4"]', side: "top",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Confirm carrier & freight",
        body: "Review the carrier, delivery window and pallet count for each shipment, then click <b>Confirm shipment information</b>.",
        tip: "The pallet count must match what actually ships — your carrier needs it for the appointment.",
        action: "click",
      },

      /* ---------------- DONE · TRACKING ---------------- */
      {
        mkey: "done", chip: "Final step · Tracking",
        target: '[data-tour="save-tracking"]', side: "top",
        scenario: sendfc({ openStep: 5, done: [1, 2, 3, 4], placement: "optimized" }),
        title: "Add tracking and finish",
        body: "Enter your PRO / freight bill number, then click <b>Save</b> to complete the plan.",
        tip: "Your BOL must carry the Amazon Reference ID, box & pallet counts, and the PRO number.",
        action: "click",
      },
    ],
  });
})();
