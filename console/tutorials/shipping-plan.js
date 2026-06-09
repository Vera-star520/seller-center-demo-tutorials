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
    summary: "Walk through the full Send to Amazon flow - from selecting inventory to downloading labels, pack lists, and completing carrier details.",
    est: "8–10 min",
    libraryOrder: 2,
    rail: {
      order: ["start", "1", "2", "3", "4", "done"],
      label: { start: "Start", "1": "Choose inventory", "2": "Confirm shipping", "3": "Print labels", "4": "Confirm carrier", done: "Done" },
      glyph: { start: "▸", done: "✓" },
    },
    doneTitle: "Plan complete!",
    doneBody: "Your shipping plan has been created successfully.<br>Before sending your shipment, please provide the following information to FBABEE.",
    doneChecklist: {
      title: "Information to Send to FBABEE",
      groups: [
        {
          title: "For LTL / FTL shipments",
          intro: "Please send:",
          items: [
            "Amazon Reference ID for each shipment",
            "SKU list / packing list with Box IDs",
            "FBA box labels",
          ],
        },
        {
          title: "For SPD shipments",
          intro: "Please send:",
          items: [
            "SKU list / packing list with Box IDs",
            "FBA box labels",
          ],
        },
      ],
    },
    steps: [
      /* ---------------- START ---------------- */
      {
        mkey: "start", chip: "FBABEE · Guided tutorial", target: "", side: "center",
        scenario: { reset: true },
        title: "Create an FBA Shipping Plan",
        body: "This guided tutorial shows how to create an FBA shipping plan, from selecting products to entering tracking details. Follow the highlighted control, or click outside the spotlight to explore Seller Central freely.",
        tip: "This is a safe demo. Nothing here affects a real Amazon account.",
        action: "next",
      },
      {
        mkey: "start", chip: "Start · Navigation", target: '[data-tour="burger"]', side: "right",
        scenario: { page: "home", menuOpen: false },
        title: "Open the main menu",
        body: "Everything starts from the main menu. Click the <b>menu icon</b> in the top-left corner.",
        action: "click",
      },
      {
        mkey: "start", chip: "Start · Navigation", target: '[data-tour="menu-inventory"]', side: "right",
        scenario: { page: "home", menuOpen: true, menuExpand: null },
        title: "Find the Inventory menu",
        body: "Hover over <b>Inventory</b> to open the fulfillment tools submenu on the right.",
        action: "next",
      },
      {
        mkey: "start", chip: "Start · Navigation", target: '[data-tour="menu-fba-inventory"]', side: "right",
        scenario: { page: "home", menuOpen: true, menuExpand: "inventory" },
        title: "Open FBA Inventory",
        body: "In the submenu, click <b>FBA Inventory</b> to view the products available for FBA shipments.",
        action: "click",
      },
      {
        mkey: "1", sub: "1a", subLabel: "Select inventory", chip: "Step 1a · Select inventory", target: '[data-tour="ck-0"]', side: "right",
        scenario: { page: "inventory", menuOpen: false, menuExpand: null },
        title: "Select your first product",
        body: "Check the box next to the product you want to ship.",
        action: "click",
      },
      {
        mkey: "1", sub: "1a", chip: "Step 1a · Select inventory", target: '[data-tour="ck-1"]', side: "right",
        scenario: { page: "inventory", menuOpen: false, selected: [0] },
        title: "Select a second product",
        body: "Select another <b>SKU</b> to include it in the same shipping plan.",
        tip: "You can include several <b>SKUs</b> in one shipping plan. Select as many as you need.",
        action: "click",
      },
      {
        mkey: "1", sub: "1a", chip: "Step 1a · Select inventory", target: '[data-tour="group-action"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [0, 1], groupOpen: false },
        title: "Open group actions",
        body: "With products selected, the action bar appears at the bottom. Click <b>Select group action</b>.",
        action: "click",
      },
      {
        mkey: "1", sub: "1a", chip: "Step 1a · Select inventory", target: '[data-tour="send-fba"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [0, 1], groupOpen: true },
        title: "Send to FBA",
        body: "Choose <b>Send to FBA</b> to start a shipping plan with the selected products.",
        action: "click",
      },

      /* ---------------- 1 · CHOOSE INVENTORY ---------------- */
      {
        mkey: "1", sub: "1b", subLabel: "Send to Amazon", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="ship-from-address"]', side: "bottom",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }),
        title: "Select ship-from address",
        body: "Use the address where the inventory will ship from. You may enter your supplier's address, or use the <b>FBABEE warehouse address</b> provided below.",
        tip: `<b>FBABEE warehouse address:</b>
          <div class="tip-lines">
            <div><b>Country/Region:</b> China</div>
            <div><b>Company name:</b> FBABEE</div>
            <div><b>Full name:</b> Your name</div>
            <div><b>Street address:</b> Bld #2, Haoyuntong Park Science and Technology Park</div>
            <div><b>City:</b> Dongguan</div>
            <div><b>District:</b> Tangxia</div>
            <div><b>State/Province:</b> Guangdong</div>
            <div><b>Zip/Postal code:</b> 523710</div>
            <div><b>Phone number:</b> Your phone number</div>
          </div>`,
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="marketplace-destination"]', side: "bottom",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }),
        title: "Select marketplace destination",
        body: "Select the <b>Amazon marketplace</b> where this inventory will be sent, such as <b>United States</b>.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="package-template-0"]', side: "top",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }),
        title: "Select or create Packing template",
        body: "Choose an existing <b>Packing template</b> or create a new one to save box information for future shipments.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="packing-form"]', side: "right",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }, { type: "packing" }),
        title: "Enter Packing template details",
        body: "Complete all required fields in the <b>Packing template</b> before saving it.",
        tip: `<div class="tip-lines">
          <div><b>Packing template name:</b> Use the box pack quantity or another clear name you can recognize later.</div>
          <div><b>Template type:</b> Select <b>Case pack</b>.</div>
          <div><b>Units per box:</b> Enter how many sellable units are inside one box.</div>
          <div><b>Box dimensions:</b> Enter the outer box length, width, and height in inches.</div>
          <div><b>Box weight:</b> Enter the actual packed box weight in pounds.</div>
          <div><b>Prep and barcode:</b> Select <b>No prep needed</b>.</div>
        </div>`,
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="save-template"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }, { type: "packing" }),
        title: "Save Packing template",
        body: "Save the <b>Packing template</b>, then repeat this step for any <b>SKU</b> that still shows packing details needed.",
        action: "click",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="qty-0"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }),
        title: "Set boxes to send",
        body: "Enter the number of boxes to send for the first <b>SKU</b>. The <b>Units</b> field fills in automatically: units = boxes x units per box.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="confirm-sku-0"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }),
        title: "Confirm the first SKU",
        body: "After the green <b>Confirm to send</b> button appears, click it to confirm the first <b>SKU</b>.",
        tip: "The SKU will move to the <b>SKUs ready to send</b> tab after it is confirmed.",
        action: "click",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="qty-1"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [0] }),
        title: "Set boxes for the second SKU",
        body: "Enter the number of boxes to send for the second <b>SKU</b>. Review the calculated <b>Units</b> before continuing.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="confirm-sku-1"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [0] }),
        title: "Confirm the second SKU",
        body: "Click the green <b>Confirm to send</b> button for the second <b>SKU</b>.",
        tip: "Make sure each selected <b>SKU</b> has been confirmed before moving to the next step.",
        action: "click",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="confirm-step1"]', side: "top",
        scenario: sendfc({ openStep: 1, done: [] }),
        title: "Confirm and continue",
        body: "All selected <b>SKUs</b> are ready. Click <b>Confirm and continue</b> to move on to shipping.",
        tip: "Please double-check that all <b>SKUs</b> and quantities are correct before you confirm and continue.",
        action: "click",
      },

      /* ---------------- 2 · CONFIRM SHIPPING ---------------- */
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="mode-own"]', side: "bottom",
        scenario: sendfc({ openStep: 2, done: [1] }),
        title: "Select your carrier option",
        body: "Select <b>Use your own carrier</b>.",
        tip: "Select this option because <b>FBABEE</b> will arrange the transportation for this shipment, not Amazon's partnered carrier service.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="placement-options-capture"]', side: "top",
        scenario: sendfc({ openStep: 2, done: [1], shipMode: "own" }),
        title: "Send placement screenshots to FBABEE",
        body: "Before choosing a placement option, send <b>FBABEE</b> screenshots showing the boxes, destination fulfillment center(s), and placement fees for each option.<br><br>Wait for <b>FBABEE's recommendation</b> before selecting the option in Seller Central.",
        tip: `<div class="tip-lines">
          <div>Capture all three placement options:</div>
          <div>- <b>Amazon-optimized</b></div>
          <div>- <b>Partial Splits</b></div>
          <div>- <b>Minimal Splits</b></div>
          <div>Each screenshot should clearly show:</div>
          <div>- Destination fulfillment center(s)</div>
          <div>- Number of boxes assigned to each destination</div>
          <div>- Placement fee</div>
          <div>FBABEE will recommend the best option for your shipment.</div>
        </div>`,
        action: "next",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="placement-shipping-mode"]', side: "bottom",
        scenario: sendfc({ openStep: 2, done: [1], shipMode: "own", placement: "optimized" }),
        title: "Select transportation method",
        body: "After FBABEE replies, select the <b>transportation method</b> recommended for your shipment.",
        tip: "If you have not received <b>FBABEE's recommendation</b> yet, pause here and contact FBABEE before continuing.",
        action: "next",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="delivery-window"]', side: "bottom",
        scenario: sendfc({ openStep: 2, done: [1], shipMode: "own", placement: "optimized" }),
        title: "Set delivery window",
        body: "Select the <b>delivery window</b> based on FBABEE's recommendation.<br><br>If no recommendation has been provided yet, select a delivery window about one month from today.",
        tip: "FBABEE support will notify you when an estimated delivery window is available, or if the delivery window needs to be changed.",
        action: "next",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="confirm-step2"]', side: "top",
        scenario: sendfc({ openStep: 2, done: [1], shipMode: "own", placement: "optimized" }),
        title: "Confirm shipping destinations",
        body: "This creates one shipment for each destination fulfillment center. Click <b>Confirm shipping destinations</b> only after the recommended option is selected.",
        action: "click",
      },

      /* ---------------- 3 · PRINT LABELS ---------------- */
      {
        mkey: "3", sub: "3a", subLabel: "Box labels", chip: "Step 3a · Print box labels",
        target: '[data-tour="label-format"]', side: "left",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "Select label format",
        body: "Select <b>Thermal printing - 4 x 6 inches</b>.",
        tip: "This format is recommended for thermal label printers and is the standard format for <b>box labels</b>.",
        action: "next",
      },
      {
        mkey: "3", sub: "3a", chip: "Step 3a · Print box labels",
        target: '[data-tour="print-labels"]', side: "left",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "Download box labels",
        body: "Click <b>Print</b> to generate the <b>box labels</b>.",
        tip: "Amazon will open the label file automatically. Download and save the file, then send it to <b>FBABEE</b>.",
        action: "click",
      },
      {
        mkey: "3", sub: "3b", subLabel: "Box contents", chip: "Step 3b · Box contents",
        target: '[data-tour="view-edit-contents"]', side: "bottom",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "Open box contents",
        body: "Click <b>View or edit contents</b> to open the box contents page and access the <b>pack list</b>.",
        action: "click",
      },
      {
        mkey: "3", sub: "3b", chip: "Step 3b · Box contents",
        target: '[data-tour="print-pack-list"]', side: "left",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }, { type: "boxes" }),
        title: "Download pack list",
        body: "Click <b>Print pack list.csv</b> to download the <b>pack list</b> for this shipment.",
        tip: "The file downloads to your computer automatically.<br><br>Save the <b>pack list</b> together with the <b>box labels</b> for later use.",
        action: "click",
      },
      {
        mkey: "3", sub: "3b", chip: "Step 3 · Print labels",
        target: '[data-tour="continue-step3"]', side: "top",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "Continue to carrier info",
        body: "Before continuing, make sure you have downloaded:<br>- All <b>box labels</b> for every shipment<br>- All <b>pack lists</b> for every shipment<br><br>After all files are downloaded and saved, click <b>Continue to carrier and pallet information</b>.",
        action: "click",
      },

      /* ---------------- 4 · CONFIRM CARRIER ---------------- */
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="carrier-type"]', side: "bottom",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Select carrier type",
        body: "Select <b>FIST Carriers</b> or <b>FBABEE (ShipTrack)</b> if the option is available, so FBABEE can manage transportation and appointment scheduling.<br><br>If you do not see either option, contact FBABEE before continuing.",
        action: "next",
      },
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="transportation-method"]', side: "bottom",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Confirm transportation method",
        body: "Select the <b>transportation method</b> recommended by FBABEE.<br><br>- <b>Ocean</b> = Sea Freight<br>- <b>Air</b> = Air Freight<br>- <b>Ground</b> = Ground Transportation<br><br>Choose the option that matches your shipment plan.",
        tip: "If you are unsure which option to select, contact FBABEE before continuing.",
        action: "next",
      },
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="delivery-window-step4"]', side: "left",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Set delivery window",
        body: "Select the <b>delivery window</b> based on FBABEE's recommendation.<br><br>If you are unsure, select a delivery window about one month from today.<br><br>For US shipments, check:<br><br><b>Allow FIST carriers to update my delivery window</b><br><br>This lets FBABEE update the delivery window for you.",
        action: "next",
      },
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="pallet-information"]', side: "left",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Review pallet information",
        body: "You may leave the <b>pallet information</b> fields blank for now.",
        action: "next",
      },
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="confirm-step4"]', side: "top",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Confirm carrier and freight",
        body: "Review the carrier type, delivery window, and pallet information before confirming.<br><br>Once everything is correct, click <b>Confirm shipment information</b>.",
        action: "click",
      },

      /* ---------------- DONE · TRACKING ---------------- */
      {
        mkey: "done", chip: "Final step · Tracking",
        target: '[data-tour="pro-freight-number"]', side: "top",
        scenario: sendfc({ openStep: 5, done: [1, 2, 3, 4], placement: "optimized" }),
        title: "Enter PRO / freight bill number",
        body: "<b>For US shipments</b>:<br><br>Please check <b>Allow FIST carriers to update my delivery window</b>, FBABEE will automatically sync the tracking number to Amazon.<br><br>You may leave this field blank and continue.<br><br><b>For other marketplaces</b>:<br><br>• <b>LTL shipments:</b> You may enter the Amazon Reference ID.<br>• <b>SPD shipments:</b> Enter the tracking number provided by FBABEE.",
        tip: "If tracking is not synced successfully after you checked “Allow FIST carriers to update my delivery window”, FBABEE will contact you and remind you to update it manually.",
        action: "next",
      },
      {
        mkey: "done", chip: "Final step · Tracking",
        target: '[data-tour="save-tracking"]', side: "top",
        scenario: sendfc({ openStep: 5, done: [1, 2, 3, 4], placement: "optimized" }),
        title: "Save the shipping plan",
        body: "Review the shipment information one final time.<br><br>When everything is correct, click <b>Save</b> to complete the shipping plan.",
        action: "click",
      },
    ],
  });
})();
