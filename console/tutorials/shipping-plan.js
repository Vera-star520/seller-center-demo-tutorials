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
        mkey: "1", sub: "1a", subLabel: "Select inventory", chip: "Step 1a · Select inventory", target: '[data-tour="ck-0"]', side: "right",
        scenario: { page: "inventory", menuOpen: false, menuExpand: null },
        title: "Pick your first product",
        body: "Tick the checkbox next to a product you want to ship.",
        tip: "You can ship several SKUs in one plan — select as many as you need.",
        action: "click",
      },
      {
        mkey: "1", sub: "1a", chip: "Step 1a · Select inventory", target: '[data-tour="ck-1"]', side: "right",
        scenario: { page: "inventory", menuOpen: false, selected: [0] },
        title: "Add a second product",
        body: "Select another SKU too, so we build a plan with two products.",
        action: "click",
      },
      {
        mkey: "1", sub: "1a", chip: "Step 1a · Select inventory", target: '[data-tour="group-action"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [0, 1], groupOpen: false },
        title: "Open group actions",
        body: "With products selected, an action bar appears at the bottom. Click <b>Select group action</b>.",
        action: "click",
      },
      {
        mkey: "1", sub: "1a", chip: "Step 1a · Select inventory", target: '[data-tour="send-fba"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [0, 1], groupOpen: true },
        title: "Send to FBA",
        body: "Choose <b>Send to FBA</b> to start a shipping plan with your selected products.",
        action: "click",
      },

      /* ---------------- 1 · CHOOSE INVENTORY ---------------- */
      {
        mkey: "1", sub: "1b", subLabel: "Send to Amazon", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="ship-from-address"]', side: "bottom",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }),
        title: "Select Ship From Address",
        body: "This address represents the <b>origin of the inventory</b> being shipped to Amazon. You can enter your own supplier address, or use the FBABEE warehouse address.",
        tip: `FBABEE warehouse address:
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
        title: "Select Marketplace Destination",
        body: "Choose the Amazon Marketplace where this inventory will be sent, for example <b>United States</b>.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="package-template-0"]', side: "top",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }),
        title: "Select or Create Package Template",
        body: "Choose an existing package template or create a new one to save packaging information for future shipments.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="packing-form"]', side: "right",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }, { type: "packing" }),
        title: "Enter packing details",
        body: "Complete the full packing template form before saving it.",
        tip: `<div class="tip-lines">
          <div><b>Packing template name:</b> Use the box pack quantity or another clear name you can recognize later.</div>
          <div><b>Template type:</b> Choose Case pack.</div>
          <div><b>Units per box:</b> Enter how many sellable units are inside one carton.</div>
          <div><b>Box dimensions:</b> Enter the outer carton length, width, and height in inches.</div>
          <div><b>Box weight:</b> Enter the actual packed carton weight in pounds.</div>
          <div><b>Prep and barcode:</b> No prep needed.</div>
        </div>`,
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="save-template"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }, { type: "packing" }),
        title: "Save Template",
        body: "Save the template, then repeat this step for any other SKU that still shows packing details needed.",
        action: "click",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="qty-0"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [] }),
        title: "Set the boxes to send",
        body: "Enter how many <b>boxes</b> to send for the first SKU. The <b>Units</b> field fills in automatically — units = boxes × units per box.",
        tip: "When boxes are set, a green <b>Confirm to send</b> button appears. Confirming locks the SKU and moves it to the <b>SKUs ready to send</b> tab.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
        target: '[data-tour="qty-1"]', side: "left",
        scenario: sendfc({ openStep: 1, done: [], ready: [0] }),
        title: "Boxes for the second SKU",
        body: "Do the same for the second product — set its <b>boxes</b> and the units calculate automatically, then confirm it to send.",
        action: "next",
      },
      {
        mkey: "1", sub: "1b", chip: "Step 1b · Send to Amazon",
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
        body: "Choose <b>Use your own carrier</b>.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="placement-options-capture"]', side: "top",
        scenario: sendfc({ openStep: 2, done: [1], shipMode: "own" }),
        title: "Send screenshots to FBABEE",
        body: "Please send us screenshots showing the boxes, destination warehouse(s), and placement fees for each option.<br><br>FBABEE will compare the available options and recommend the most suitable solution based on cost, transit time, and operational efficiency.",
        tip: `<div class="tip-lines">
          <div><b>Capture all three options:</b></div>
          <div>• Amazon-optimized</div>
          <div>• Partial Splits</div>
          <div>• Minimal Splits</div>
          <div><b>Make sure the screenshot clearly shows:</b></div>
          <div>• Destination warehouse(s)</div>
          <div>• Number of boxes assigned to each destination</div>
          <div>• Placement fee</div>
          <div>We will review the options and recommend the best choice for your shipment.</div>
        </div>`,
        action: "next",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="placement-shipping-mode"]', side: "bottom",
        scenario: sendfc({ openStep: 2, done: [1], shipMode: "own", placement: "optimized" }),
        title: "Choose Shipping Mode",
        body: "Choose the shipping mode recommended by FBABEE.",
        tip: `<div class="tip-lines">
          <div>We will review your placement options and recommend the most suitable shipping method based on transit time, operational efficiency, and overall shipment planning.</div>
        </div>`,
        action: "next",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="delivery-window"]', side: "bottom",
        scenario: sendfc({ openStep: 2, done: [1], shipMode: "own", placement: "optimized" }),
        title: "Set Delivery Window",
        body: "Choose the delivery window based on FBABEE's recommendation.<br>If no recommendation has been provided yet, select a delivery window approximately one month from today.",
        action: "next",
      },
      {
        mkey: "2", chip: "Step 2 · Confirm shipping",
        target: '[data-tour="confirm-step2"]', side: "top",
        scenario: sendfc({ openStep: 2, done: [1], shipMode: "own", placement: "optimized" }),
        title: "Confirm shipping destinations",
        body: "This generates a shipment to each fulfillment center. Click <b>Confirm shipping destinations</b>.",
        action: "click",
      },

      /* ---------------- 3 · PRINT LABELS ---------------- */
      {
        mkey: "3", sub: "3a", subLabel: "Box labels", chip: "Step 3a · Print box labels",
        target: '[data-tour="label-format"]', side: "left",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "Select label format",
        body: "Select <b>Thermal printing - 4 x 6 inches</b>.",
        tip: "This format is recommended for thermal label printers and is the standard format used for carton labels.",
        action: "next",
      },
      {
        mkey: "3", sub: "3a", chip: "Step 3a · Print box labels",
        target: '[data-tour="print-labels"]', side: "left",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "Print your box labels",
        body: "Click <b>Print</b> to generate the box labels.",
        tip: "Amazon will open the label file automatically. Download the file and provide it to FBABEE or print it directly if required.",
        action: "click",
      },
      {
        mkey: "3", sub: "3b", subLabel: "Box contents", chip: "Step 3b · Box contents",
        target: '[data-tour="view-edit-contents"]', side: "bottom",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "View or edit contents",
        body: "Click <b>View or edit contents</b> to review the carton details and box assignments for this shipment.",
        action: "click",
      },
      {
        mkey: "3", sub: "3b", chip: "Step 3b · Box contents",
        target: '[data-tour="print-pack-list"]', side: "left",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }, { type: "boxes" }),
        title: "Print pack list",
        body: "Click <b>Print pack list.csv</b> to download the packing list for this shipment.<br><br>The file will be downloaded automatically to your computer.<br><br>Please save the packing list together with the carton labels for later use.",
        action: "click",
      },
      {
        mkey: "3", sub: "3b", chip: "Step 3 · Print labels",
        target: '[data-tour="continue-step3"]', side: "top",
        scenario: sendfc({ openStep: 3, done: [1, 2], placement: "optimized" }),
        title: "Continue to carrier info",
        body: "Before continuing, make sure you have downloaded:<br>• All carton labels for every shipment<br>• All packing lists for every shipment<br><br>After all files have been downloaded and saved, click <b>Continue to carrier and pallet information</b>.",
        action: "click",
      },

      /* ---------------- 4 · CONFIRM CARRIER ---------------- */
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="carrier-type"]', side: "bottom",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Select carrier type",
        body: "Choose <b>FIST Carriers</b> or <b>FBABEE (ShipTrack)</b> if available.<br><br>This allows FBABEE to manage transportation and appointment scheduling for your shipment.",
        action: "next",
      },
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="transportation-method"]', side: "bottom",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Select transportation method",
        body: "Select the transportation method recommended by FBABEE.<br><br>• Ocean = Sea Freight<br>• Air = Air Freight<br>• Ground = Ground Transportation<br><br>Choose the option that matches your shipment plan.",
        tip: "If you are unsure which option to choose, contact FBABEE before continuing.",
        action: "next",
      },
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="delivery-window-step4"]', side: "left",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Set delivery window",
        body: "Choose the delivery window based on FBABEE's recommendation.<br><br>If you are unsure, select a delivery window approximately one month from today.<br><br>For US shipments, enable:<br><br><b>✓ Allow FIST carriers to update my delivery window</b><br><br>This allows us to update the delivery window for you.",
        action: "next",
      },
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="pallet-information"]', side: "left",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Review pallet information",
        body: "You may leave these fields blank for now.",
        action: "next",
      },
      {
        mkey: "4", chip: "Step 4 · Carrier & freight",
        target: '[data-tour="confirm-step4"]', side: "top",
        scenario: sendfc({ openStep: 4, done: [1, 2, 3], placement: "optimized" }),
        title: "Confirm carrier & freight",
        body: "Review the carrier, delivery window, and pallet information before confirming.<br><br>Once everything has been verified, click <b>Confirm shipment information</b>.",
        action: "click",
      },

      /* ---------------- DONE · TRACKING ---------------- */
      {
        mkey: "done", chip: "Final step · Tracking",
        target: '[data-tour="pro-freight-number"]', side: "top",
        scenario: sendfc({ openStep: 5, done: [1, 2, 3, 4], placement: "optimized" }),
        title: "Enter PRO / freight bill number",
        body: "Enter the shipment reference number.<br><br>• LTL shipments: You may enter the Amazon Reference ID.<br><br>• SPD shipments: Enter the tracking number provided by FBABEE.<br><br>This information allows Amazon to identify and track the inbound shipment.",
        tip: `<div class="tip-lines">
          <div>For US shipments using SPD:</div>
          <div>If you enabled <b>"Allow FIST carriers to update my delivery window"</b>, FBABEE will automatically sync the tracking number to Amazon.</div>
          <div>In that case, you may leave this field blank and continue.</div>
        </div>`,
        action: "next",
      },
      {
        mkey: "done", chip: "Final step · Tracking",
        target: '[data-tour="save-tracking"]', side: "top",
        scenario: sendfc({ openStep: 5, done: [1, 2, 3, 4], placement: "optimized" }),
        title: "Click Save to complete the plan",
        body: "Review the shipment information one final time.<br><br>Once everything is correct, click <b>Save</b> to complete the shipping plan.",
        action: "click",
      },
    ],
  });
})();
