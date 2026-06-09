/* ============================================================
   Tutorial: Create a Removal Order — minimal viable removal flow.
   Requires console/tutorials/_shared.js (loaded first).
   ============================================================ */
(function () {
  const { register } = window.TutorialKit;

  const removalScenario = (extra) => ({
    page: "removal",
    menuOpen: false,
    menuExpand: null,
    groupOpen: false,
    selected: [4],
    removal: Object.assign({
      skus: [4],
      openStep: 1,
      done: [],
      method: null,
      addressId: "werner",
      addressConfirmed: false,
      submitted: false,
      qty: { 4: 24 },
    }, extra || {}),
  });

  register({
    id: "create-removal",
    title: "Create a Removal Order",
    category: "Inventory",
    level: "Core workflow",
    summary: "Return, dispose of, or liquidate selected FBA inventory through a safe sandbox removal order.",
    est: "4 min",
    url: "sellercentral.amazon.com/fba/removalorder",
    doneTitle: "Removal order complete!",
    doneBody: "You've walked through the sandbox removal flow from selecting inventory to submitting the order. In a real account, keep tracking the removal until units are returned, disposed, or liquidated.",
    rail: {
      order: ["start", "1", "2", "3", "4", "done"],
      label: { start: "Start", "1": "Choose inventory", "2": "Select method", "3": "Confirm address", "4": "Review & submit", done: "Done" },
      glyph: { start: "▸", done: "✓" },
    },
    steps: [
      {
        mkey: "start", chip: "FBABEE · Guided tutorial", target: "", side: "center",
        scenario: { reset: true },
        title: "Create a Removal Order",
        body: "We'll create a training-only FBA removal order: choose inventory, select a removal method, confirm the return address, and submit the sandbox order.",
        tip: "Safe sandbox: nothing here affects a real account, real inventory, or real fees.",
        action: "next",
      },
      {
        mkey: "start", chip: "Start · Navigation", target: '[data-tour="burger"]', side: "right",
        scenario: { page: "home", menuOpen: false },
        title: "Open the main menu",
        body: "Start from the menu in the top-left, just like you would from the seller console home page.",
        action: "click",
      },
      {
        mkey: "start", chip: "Start · Navigation", target: '[data-tour="menu-inventory"]', side: "right",
        scenario: { page: "home", menuOpen: true, menuExpand: null },
        title: "Find Inventory",
        body: "Hover over <b>Inventory</b> to reveal the fulfillment tools for FBA inventory.",
        tip: "Removal orders start from inventory because the order is built around selected SKUs and units.",
        action: "next",
      },
      {
        mkey: "start", chip: "Start · Navigation", target: '[data-tour="menu-fba-inventory"]', side: "right",
        scenario: { page: "home", menuOpen: true, menuExpand: "inventory" },
        title: "Open FBA Inventory",
        body: "Click <b>FBA Inventory</b> to choose the item you want to remove.",
        action: "click",
      },

      {
        mkey: "1", chip: "Step 1 · Choose inventory", target: '[data-tour="ck-4"]', side: "right",
        scenario: { page: "inventory", menuOpen: false, menuExpand: null, selected: [] },
        title: "Select an inventory item",
        body: "Tick the checkbox next to the beanie SKU. It has excess units, so it is a good demo candidate for removal.",
        action: "click",
      },
      {
        mkey: "1", chip: "Step 1 · Choose inventory", target: '[data-tour="group-action"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [4], groupOpen: false },
        title: "Open group actions",
        body: "With the SKU selected, open <b>Select group action</b> at the bottom of the page.",
        action: "click",
      },
      {
        mkey: "1", chip: "Step 1 · Choose inventory", target: '[data-tour="create-removal"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [4], groupOpen: true },
        title: "Create the removal order",
        body: "Choose <b>Create removal order</b> to start a removal order for the selected inventory.",
        action: "click",
      },
      {
        mkey: "1", chip: "Step 1 · Choose inventory", target: '[data-tour="removal-inventory"]', side: "top",
        scenario: removalScenario({ openStep: 1, done: [] }),
        title: "Review selected units",
        body: "Check the SKU and the unit quantity before continuing. This demo removes 24 units from the selected beanie SKU.",
        tip: "In a real account, confirm whether the units are sellable, unsellable, excess, or part of an exception case before removing them.",
        action: "next",
      },
      {
        mkey: "1", chip: "Step 1 · Choose inventory", target: '[data-tour="removal-confirm-inventory"]', side: "top",
        scenario: removalScenario({ openStep: 1, done: [] }),
        title: "Confirm inventory",
        body: "Click <b>Confirm inventory</b> to lock the selected SKU and move to the removal method.",
        action: "click",
      },

      {
        mkey: "2", chip: "Step 2 · Select removal method", target: '[data-tour="removal-method-return"]', side: "bottom",
        scenario: removalScenario({ openStep: 2, done: [1], method: null }),
        title: "Choose return to address",
        body: "Select <b>Return to address</b>. This is the right choice when units should go back to your warehouse or prep partner for inspection or resale.",
        tip: "Disposal and liquidation can be useful, but they should be chosen only when the business reason is clear.",
        action: "click",
      },

      {
        mkey: "3", chip: "Step 3 · Confirm address", target: '[data-tour="removal-address"]', side: "top",
        scenario: removalScenario({ openStep: 3, done: [1, 2], method: "return", addressConfirmed: false }),
        title: "Check the return address",
        body: "Review the return-to address and make sure the receiving team can accept returned FBA units.",
        action: "next",
      },
      {
        mkey: "3", chip: "Step 3 · Confirm address", target: '[data-tour="removal-confirm-address"]', side: "top",
        scenario: removalScenario({ openStep: 3, done: [1, 2], method: "return", addressConfirmed: false }),
        title: "Confirm the address",
        body: "Click <b>Use this return address</b> to continue.",
        action: "click",
      },

      {
        mkey: "4", chip: "Step 4 · Review and submit", target: '[data-tour="removal-review"]', side: "top",
        scenario: removalScenario({ openStep: 4, done: [1, 2, 3], method: "return", addressConfirmed: true }),
        title: "Review the order",
        body: "Review the removal method, return address, selected inventory, and expected processing window.",
        action: "next",
      },
      {
        mkey: "4", chip: "Step 4 · Review and submit", target: '[data-tour="removal-submit"]', side: "top",
        scenario: removalScenario({ openStep: 4, done: [1, 2, 3], method: "return", addressConfirmed: true }),
        title: "Submit the sandbox order",
        body: "Click <b>Submit removal order</b>. In this sandbox, submission only completes the demo flow.",
        tip: "For a real order, check removal fees, destination details, and internal approval before submitting.",
        action: "click",
      },

      {
        mkey: "done", chip: "Done · Track removal", target: '[data-tour="removal-done"]', side: "bottom",
        scenario: removalScenario({ openStep: 4, done: [1, 2, 3, 4], method: "return", addressConfirmed: true, submitted: true }),
        title: "Removal order submitted",
        body: "The sandbox order is complete. In the real workflow, track the order until Amazon confirms the final returned, disposed, or liquidated units.",
        action: "next",
      },
    ],
  });
})();
