/* ============================================================
   Tutorial: How to Print FNSKU Labels - FBA Inventory item labels.
   Requires console/tutorials/_shared.js (loaded first).
   ============================================================ */
(function () {
  const { register } = window.TutorialKit;

  const fnskuScenario = (extra) => ({
    page: "inventory",
    menuOpen: false,
    menuExpand: null,
    groupOpen: false,
    selected: [0, 1],
    fnskuLabels: Object.assign({ itemIndexes: [0, 1], qty: [1, 1] }, extra || {}),
  });

  register({
    id: "print-fnsku-labels",
    title: "How to Print FNSKU Labels",
    category: "Inventory",
    level: "Inventory setup",
    summary: "Learn where to download and print FNSKU labels for your FBA products.",
    est: "3 min",
    url: "sellercentral.amazon.com/fba/inventory",
    libraryOrder: 1,
    doneTitle: "FNSKU labels tutorial complete!",
    doneBody: "You've walked through the safe demo flow for opening FBA Inventory, selecting SKUs, and reaching the FNSKU label PDF download action.",
    rail: {
      order: ["start", "1", "2", "3", "4", "done"],
      label: {
        start: "Start",
        "1": "Open FBA Inventory",
        "2": "Select SKUs",
        "3": "Print item labels",
        "4": "Download PDF",
        done: "Done",
      },
      glyph: { start: "▸", done: "✓" },
    },
    steps: [
      {
        mkey: "start", chip: "FBABEE · Guided tutorial", target: "", side: "center",
        scenario: { reset: true },
        title: "Print FNSKU Labels",
        body: "In this tutorial, you'll learn how to find your FBA products and download FNSKU item labels for printing. Before starting, know which SKU or ASIN you need labels for.",
        action: "next",
      },
      {
        mkey: "1", chip: "Open FBA Inventory", target: '[data-tour="burger"]', side: "right",
        scenario: { page: "home", menuOpen: false },
        title: "Open the main menu",
        body: "Start from the Seller Central demo dashboard. Open the navigation menu to find your inventory tools.",
        action: "click",
      },
      {
        mkey: "1", chip: "Open FBA Inventory", target: '[data-tour="menu-inventory"]', side: "right",
        scenario: { page: "home", menuOpen: true, menuExpand: null },
        title: "Find the Inventory menu",
        body: "Hover over <b>Inventory</b> to open the fulfillment tools submenu on the right.",
        action: "next",
      },
      {
        mkey: "1", chip: "Open FBA Inventory", target: '[data-tour="menu-fba-inventory"]', side: "right",
        scenario: { page: "home", menuOpen: true, menuExpand: "inventory" },
        title: "Open FBA Inventory",
        body: "In the submenu, click <b>FBA Inventory</b> to view the products available for FBA shipments.",
        action: "click",
      },
      {
        mkey: "2", chip: "Select SKUs", target: '[data-tour="inventory-search"]', side: "bottom",
        scenario: { page: "inventory", menuOpen: false, menuExpand: null, selected: [], groupOpen: false, fnskuLabels: null },
        title: "Find the product",
        body: "Search by SKU, ASIN, or product name, then confirm you are choosing the correct FBA listing.",
        tip: "Use placeholder product data only.",
        action: "next",
      },
      {
        mkey: "2", chip: "Select SKUs", target: '[data-tour="ck-0"]', side: "right",
        scenario: { page: "inventory", menuOpen: false, selected: [], groupOpen: false, fnskuLabels: null },
        title: "Select the first SKU",
        body: "Check the box next to the first product you want to print FNSKU labels for.",
        tip: "You can print labels for more than one SKU at the same time.",
        action: "click",
      },
      {
        mkey: "2", chip: "Select SKUs", target: '[data-tour="ck-1"]', side: "right",
        scenario: { page: "inventory", menuOpen: false, selected: [0], groupOpen: false, fnskuLabels: null },
        title: "Select the second SKU",
        body: "Check one more product so the label page can include multiple SKUs.",
        tip: "The label page will only include the SKUs you select.",
        action: "click",
      },
      {
        mkey: "3", chip: "Print item labels", target: '[data-tour="group-action"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [0, 1], groupOpen: false, fnskuLabels: null },
        title: "Open group actions",
        body: "Click the group action menu to choose what to do with the selected SKUs.",
        tip: "The same action will apply to the SKUs you selected.",
        action: "click",
      },
      {
        mkey: "3", chip: "Print item labels", target: '[data-tour="print-item-labels"]', side: "top",
        scenario: { page: "inventory", menuOpen: false, selected: [0, 1], groupOpen: true, fnskuLabels: null },
        title: "Choose Print Item Labels",
        body: "Select <b>Print Item Labels</b> to open the label setup page for the selected FBA items.",
        tip: "The next page should show only the SKUs you selected.",
        action: "click",
      },
      {
        mkey: "4", chip: "Download PDF", target: '[data-tour="fnsku-label-qty-0"]', side: "left",
        scenario: fnskuScenario(),
        title: "Review label quantities",
        body: "Check the number of labels to print for each selected SKU. Sellers usually print one label for each sellable unit.",
        tip: "Use the correct quantity before generating the PDF.",
        action: "next",
      },
      {
        mkey: "4", chip: "Download PDF", target: '[data-tour="fnsku-format"]', side: "top",
        scenario: fnskuScenario(),
        title: "Choose the label format",
        body: "Confirm the printing format and paper or sticker type before creating the label file.",
        tip: "The format should match the label sheet or printer used in real operations.",
        action: "next",
      },
      {
        mkey: "4", chip: "Download PDF", target: '[data-tour="fnsku-print-item-labels"]', side: "top",
        scenario: fnskuScenario(),
        title: "Generate the label PDF",
        body: "Click <b>Print Item Labels</b>. Amazon downloads the FNSKU label PDF to your computer.",
        tip: "This safe demo will not create a real Amazon file.",
        action: "click",
      },
    ],
  });
})();
