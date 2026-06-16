/* ============================================================
   Tutorial: Get the Reference ID for the FBA Shipment.
   Requires console/tutorials/_shared.js (loaded first).
   ============================================================ */
(function () {
  const { register } = window.TutorialKit;

  const DEMO_SHIPMENT_ID = "FBA-DEMO-SHIP-001";

  const clearChrome = {
    openNav: null,
    menuOpen: false,
    menuExpand: null,
    groupOpen: false,
    recommendedOpen: null,
    settingsOpen: false,
    modal: null,
  };

  const home = (extra) => Object.assign({}, clearChrome, {
    page: "home",
    shipmentSearchDraft: "",
    shipmentSearchQuery: "",
    shipmentSearchSubmitted: false,
  }, extra || {});

  const shippingQueue = (extra) => Object.assign({}, clearChrome, {
    page: "shipments",
  }, extra || {});

  const clearSearch = shippingQueue({
    shipmentSearchDraft: "",
    shipmentSearchQuery: "",
    shipmentSearchSubmitted: false,
  });

  const searchedShipment = shippingQueue({
    shipmentSearchDraft: DEMO_SHIPMENT_ID,
    shipmentSearchQuery: DEMO_SHIPMENT_ID,
    shipmentSearchSubmitted: true,
  });

  register({
    id: "get-reference-id",
    title: "Get the Reference ID for the FBA Shipment",
    category: "Shipments",
    level: "Shipment details",
    summary: "Find the Amazon Reference ID needed for LTL / FTL shipments.",
    est: "2 min",
    url: "sellercentral.amazon.example/fba/shipments",
    libraryOrder: 4,
    rail: {
      order: ["start", "1", "2", "done"],
      label: {
        start: "Start",
        "1": "Manage Shipments",
        "2": "Find Reference ID",
        done: "Done",
      },
      glyph: { start: "▸", done: "✓" },
    },
    doneTitle: "Reference ID found",
    doneBody: "You have completed the demo flow. In your real Seller Central account, go to Shipments &rarr; Manage Shipments, search with the actual shipment ID, and copy the Reference ID from the matching shipment row.",
    steps: [
      {
        mkey: "start", chip: "FBABEE · Guided tutorial", target: "", side: "center",
        scenario: { reset: true },
        title: "Get the Reference ID for the FBA Shipment",
        body: "This tutorial shows how to find the Reference ID for an FBA shipment from Manage Shipments. Before you start, have the shipment ID you want to search for.",
        tip: "This demo uses safe placeholder data and does not connect to a real Amazon account.",
        action: "next",
      },
      {
        mkey: "1", chip: "Step 1 · Manage Shipments", target: '[data-tour="burger"]', side: "right",
        scenario: home({ menuOpen: false }),
        title: "Open the main menu",
        body: "Click the main menu to open Seller Central navigation.",
        action: "click",
      },
      {
        mkey: "1", chip: "Step 1 · Manage Shipments", target: '[data-tour="shipments-menu-item"]', side: "right",
        scenario: home({ menuOpen: true, menuExpand: null }),
        title: "Open Shipments",
        body: "Click <b>Shipments</b> to open shipment-related options.",
        action: "click",
      },
      {
        mkey: "1", chip: "Step 1 · Manage Shipments", target: '[data-tour="manage-shipments-menu-item"]', side: "right",
        scenario: home({ menuOpen: true, menuExpand: "shipments" }),
        title: "Open Manage Shipments",
        body: "Click <b>Manage Shipments</b> to open the Shipping Queue.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Find Reference ID", target: '[data-tour="shipment-id-search-input"]', side: "left",
        scenario: clearSearch,
        title: "Locate the shipment search",
        body: "Use the <b>Shipment ID</b> field to search for the shipment you need. In this demo, use <b>FBA-DEMO-SHIP-001</b>.",
        tip: "In your real Seller Central account, enter the actual shipment ID from your shipment record.",
        action: "next",
      },
      {
        mkey: "2", chip: "Step 2 · Find Reference ID", target: '[data-tour="shipment-id-search-input"]', side: "left",
        scenario: clearSearch,
        title: "Enter the demo shipment ID",
        body: "Enter <b>FBA-DEMO-SHIP-001</b> in the Shipment ID field.",
        action: "next",
      },
      {
        mkey: "2", chip: "Step 2 · Find Reference ID", target: '[data-tour="shipment-id-search-button"]', side: "left",
        scenario: shippingQueue(),
        title: "Search the shipment",
        body: "Click <b>Search</b> to find the matching shipment.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Find Reference ID", target: '[data-tour="demo-shipment-row"]', side: "top",
        scenario: searchedShipment,
        title: "Review the matching shipment",
        body: "The matching shipment appears in the Shipping Queue. Confirm that the shipment ID matches your search.",
        tip: "Always verify the shipment row before copying or sharing any ID.",
        action: "next",
      },
      {
        mkey: "2", chip: "Step 2 · Find Reference ID", target: '[data-tour="demo-reference-id-cell"]', side: "top",
        scenario: searchedShipment,
        title: "Find the Reference ID",
        body: "The Reference ID is shown in the matching shipment row. Use this ID when FBABEE asks for the shipment reference.",
        tip: "In your real account, copy the Reference ID from the row that matches your shipment ID.",
        action: "next",
      },
    ],
  });
})();
