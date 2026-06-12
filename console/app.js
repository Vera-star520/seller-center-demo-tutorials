/* ============================================================
   Console core: state, chrome (top bar / sub bar / FBA nav),
   page router, modal system, and a delegated action dispatch.
   Pages and the Send-to-FC wizard register into App.pages / App.actions.
   ============================================================ */
window.App = (function () {
  const D = window.DATA;
  const ASSISTANT_PERMISSION_DEFAULTS = {
    awdSecondaryUserAccess: "none",
    fulfillmentPrograms: "none",
    inventoryPlanning: "none",
    inventoryPerformance: "none",
    manageFbaInventoryShipments: "none",
    addProductsViaUpload: "none",
    europeanExpansionAccelerator: "none",
    fbaAnalytics: "none",
    fbaDashboard: "none",
    globalFbaInventory: "none",
    imageManagement: "none",
    inboundPerformanceDashboard: "none",
    itemClassificationGuide: "none",
    listByUploadingNonAmazonFile: "none",
    manageFbaReturns: "none",
  };

  const state = {
    page: "home",
    openNav: null,                 // 'inventory' | 'shipments' | null
    menuOpen: false,               // hamburger slide menu
    menuExpand: null,              // expanded section in slide menu
    settingsOpen: false,            // top-right Settings menu
    selected: new Set(),           // selected SKU indices on FBA Inventory
    modal: null,                   // {render: fn} or null
    wizard: null,                  // created when entering Send to FC
    removal: null,                 // created when entering Create Removal Order
    fnskuLabels: null,             // transient state for the Print Item Labels demo window
    recommendedOpen: null,         // open row index for FBA Inventory recommended-action menu
    toast: null,                   // transient demo toast message
    userPermissionsTopTab: "management",
    userManagementTab: "employees",
    openInvitationsTab: "authorisedPartners",
    assistantInviteCreated: false,
    assistantInviteActionsOpen: false,
    assistantPermissions: Object.assign({}, ASSISTANT_PERMISSION_DEFAULTS),
    assistantPermissionsTouched: false,
    assistantPermissionsSaved: false,
  };
  let toastTimer = null;

  // ---- tiny helpers ----
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  // ---- chrome ----
  // TUTORIAL ANCHORS (public contract — see console/tutorials/, verified by
  // console/_smoke.js): data-tour="burger" (menu button), "menu-inventory"
  // (Inventory section), "menu-fba-inventory" (FBA Inventory fly-out link).
  function slideMenu() {
    if (!state.menuOpen) return "";
    const bm = `<svg class="sm-bm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4V3z"/></svg>`;
    // `sec` (set only for sections with a fly-out) gives the item a tour anchor
    // and lets state.menuExpand force the fly-out open — the real menu reveals it
    // on hover, but the guide drives it by state so it can spotlight inside it.
    const item = (label, sub, sec) => `
      <div class="sm-item ${sub ? "has-fly" : "disabled"}${sec && state.menuExpand === sec ? " open" : ""}" data-act="menu-noop"${sec ? ` data-tour="menu-${sec}"` : ""}>
        <span>${label}</span><span class="ch"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></span>
        ${sub ? `<div class="sm-fly">
          <div class="sm-link disabled"><span>Manage All Inventory</span>${bm}</div>
          <div class="sm-shead">Fulfillment by Amazon (FBA)</div>
          <div class="sm-link" data-act="goto" data-page="inventory" data-tour="menu-fba-inventory"><span>FBA Inventory</span>${bm}</div>
          <div class="sm-link" data-act="goto" data-page="shipments"><span>Shipments</span>${bm}</div>
          <div class="sm-link" data-act="goto" data-page="awd"><span>Warehousing and distribution (AWD)</span>${bm}</div>
        </div>` : ""}
      </div>`;
    return `
    <div class="sm-scrim" data-act="menu-toggle">
      <div class="sm-panel" data-act="menu-noop">
        <div class="sm-top"><span class="x" data-act="menu-toggle">&#10005;</span><b>Menu</b></div>
        ${item("Catalog")}
        ${item("Inventory", true, "inventory")}
        ${item("Orders")}
        ${item("Growth")}
        ${item("Reports")}
        ${item("Payments")}
        ${item("Brands")}
        ${item("Learn")}
      </div>
    </div>`;
  }

  function topbar() {
    return `
    <div class="topbar">
      <div class="burger" data-act="menu-toggle" data-tour="burger">&#9776;</div>
      <div class="brand" data-act="goto" data-page="home">
        <span class="logo">Seller Central</span>
      </div>
      <div class="store-pill"><b>${esc(D.STORE.name)}</b><span class="div"></span>${esc(D.STORE.country)}</div>
      <div class="topsearch"><input placeholder="Search" readonly><button>&#9906;</button></div>
      <div class="topright">
        <span class="toggle"><span class="sw"></span> New Seller Central</span>
        <span class="ic">&#10022;</span>
        <span class="ic">&#9993;</span>
        <div class="settings-menu ${state.settingsOpen ? "open" : ""}" data-settings-root>
          <button class="ic settings-trigger" type="button" data-act="settings-toggle" data-tour="settings-gear-button" aria-label="Settings">&#9881;</button>
          <div class="settings-dropdown" role="menu" aria-label="Settings">
            <button class="settings-item" type="button" role="menuitem">Account Info</button>
            <button class="settings-item" type="button" role="menuitem">Manage Accounts</button>
            <button class="settings-item" type="button" role="menuitem">Notification Preferences</button>
            <button class="settings-item" type="button" role="menuitem">Login Settings</button>
            <button class="settings-item" type="button" role="menuitem">Return Settings</button>
            <button class="settings-item" type="button" role="menuitem">Shipping Settings</button>
            <button class="settings-item" type="button" role="menuitem">Tax Settings</button>
            <button class="settings-item" type="button" role="menuitem" data-act="goto-user-permissions" data-tour="settings-user-permissions-menu-item">User Permissions</button>
            <button class="settings-item" type="button" role="menuitem">Your Info &amp; Policies</button>
            <button class="settings-item" type="button" role="menuitem">Fulfilment by Amazon</button>
            <button class="settings-item settings-sep" type="button" role="menuitem">Show Favourites Bar</button>
            <button class="settings-item" type="button" role="menuitem">Log out</button>
          </div>
        </div>
        <span>EN &#9662;</span><span>Help</span>
      </div>
    </div>`;
  }
  function subbar() {
    return `
    <div class="subbar">
      <span class="bk"><svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M1.5 1.5h11v13l-5.5-3.6-5.5 3.6z"/></svg></span>
      <span>Add Products</span>
      <span class="sp"></span>
      <button class="edit">Edit</button>
    </div>`;
  }
  function fbanav() {
    const inv = state.openNav === "inventory";
    const shp = state.openNav === "shipments";
    const on = (p) =>
      (["inventory", "removal"].includes(state.page) && p === "inv") ||
      (["shipments", "sendfc"].includes(state.page) && p === "shp");
    const caret = `<svg class="caret" viewBox="0 0 11 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l4.5 4.5L10 1"/></svg>`;
    return `
    <div class="fbanav">
      <span class="crumb">FBA <span>&#8594;</span></span>
      <div class="navitem ${on("inv") ? "active" : ""}" data-act="nav-toggle" data-nav="inventory">Inventory ${caret}
        <div class="dropdown wide ${inv ? "open" : ""}">
          <div class="ditem" data-act="goto" data-page="inventory">FBA Inventory</div>
          <div class="ditem disabled">Inventory Performance</div>
          <div class="ditem disabled">Restock Inventory</div>
          <div class="ditem disabled">Fix Stranded Inventory</div>
          <div class="ditem disabled">Unfulfillable Inventory</div>
          <div class="ditem disabled">FBA Returns</div>
          <div class="ditem disabled">Inventory Defect and Reimbursement <span class="dnew">New</span></div>
        </div>
      </div>
      <div class="navitem ${on("shp") ? "active" : ""}" data-act="nav-toggle" data-nav="shipments">Shipments ${caret}
        <div class="dropdown ${shp ? "open" : ""}">
          <div class="ditem" data-act="goto" data-page="shipments">Manage Shipments</div>
          <div class="ditem" data-act="goto" data-page="sendfc">Send to Amazon</div>
          <div class="ditem disabled">Inbound Performance</div>
        </div>
      </div>
      <div class="navitem disabled">Opportunities</div>
    </div>`;
  }

  // ---- modal ----
  function openModal(node) { state.modal = node; render(); }
  function closeModal() { state.modal = null; render(); }
  function showToast(message, options) {
    state.toast = message;
    render(options);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (state.toast === message) {
        state.toast = null;
        render(options);
      }
    }, 2400);
  }

  // ---- scenario: the single narrow entry point tutorials use to set state ----
  // A tutorial describes the console state it needs declaratively; the Demo owns
  // *how* to reach it. Only keys present in `spec` are applied — everything else
  // is left untouched — so a step sets exactly what it needs and nothing more.
  // Wizard internals are delegated to App.applyWizardScenario (send-to-fc.js) and
  // modals to App.scenarioModal, so this file never hard-codes wizard fields.
  function setScenario(spec) {
    spec = spec || {};
    if (spec.reset) App.reset();               // full clean slate, then layer keys on top
    if ("page" in spec) state.page = spec.page;
    if ("openNav" in spec) state.openNav = spec.openNav;
    if ("menuOpen" in spec) state.menuOpen = spec.menuOpen;
    if ("menuExpand" in spec) state.menuExpand = spec.menuExpand;
    if ("settingsOpen" in spec) state.settingsOpen = spec.settingsOpen;
    if ("groupOpen" in spec) state.groupOpen = spec.groupOpen;
    if ("recommendedOpen" in spec) state.recommendedOpen = spec.recommendedOpen;
    if (spec.selected) state.selected = new Set(spec.selected);
    if ("userPermissionsTopTab" in spec) state.userPermissionsTopTab = spec.userPermissionsTopTab;
    if ("userManagementTab" in spec) state.userManagementTab = spec.userManagementTab;
    if ("openInvitationsTab" in spec) state.openInvitationsTab = spec.openInvitationsTab;
    if ("assistantInviteCreated" in spec) state.assistantInviteCreated = spec.assistantInviteCreated;
    if ("assistantInviteActionsOpen" in spec) state.assistantInviteActionsOpen = spec.assistantInviteActionsOpen;
    if ("assistantPermissions" in spec) state.assistantPermissions = Object.assign({}, ASSISTANT_PERMISSION_DEFAULTS, spec.assistantPermissions || {});
    if ("assistantPermissionsTouched" in spec) state.assistantPermissionsTouched = spec.assistantPermissionsTouched;
    if ("assistantPermissionsSaved" in spec) state.assistantPermissionsSaved = spec.assistantPermissionsSaved;
    if (spec.wizard) {
      if (!state.wizard) App.initWizard();
      if (App.applyWizardScenario) App.applyWizardScenario(state.wizard, spec.wizard);
    }
    if (spec.removal) {
      if (!state.removal && App.initRemoval) App.initRemoval();
      if (App.applyRemovalScenario) App.applyRemovalScenario(state.removal, spec.removal);
    }
    if ("modal" in spec) state.modal = (spec.modal && App.scenarioModal) ? App.scenarioModal(spec.modal) : null;
    if ("assistantInviteModal" in spec) state.modal = spec.assistantInviteModal && App.assistantPartnerInviteModal ? App.assistantPartnerInviteModal() : null;
    if ("fnskuLabels" in spec && App.applyFnskuLabelsScenario) App.applyFnskuLabelsScenario(spec.fnskuLabels);
    render();
  }

  // ---- navigation ----
  function navigate(page) {
    state.page = page;
    state.openNav = null;
    state.menuOpen = false;
    state.menuExpand = null;
    state.settingsOpen = false;
    state.recommendedOpen = null;
    state.assistantInviteActionsOpen = false;
    if (page === "sendfc" && !state.wizard) App.initWizard();
    if (page === "removal" && !state.removal && App.initRemoval) App.initRemoval();
    render();
  }

  // ---- render ----
  let root = null;
  const renderHooks = [];
  function onRender(fn) { renderHooks.push(fn); }

  function render(options) {
    if (!root) return;
    const preservePageScroll = options && options.preservePageScroll;
    const pageBeforeRender = state.page;
    const scBeforeRender = preservePageScroll ? root.querySelector("#pageScroll") : null;
    const scrollTopBeforeRender = scBeforeRender ? scBeforeRender.scrollTop : null;
    const showFbaNav = ["inventory", "shipments", "sendfc", "removal", "awd"].includes(state.page);
    const fullPage = ["sendfc", "inventory", "removal", "userPermissions", "assistantPermissions"].includes(state.page);
    const pageFn = App.pages[state.page] || App.pages.home;
    root.innerHTML = `
      <div class="console">
        ${topbar()}
        ${showFbaNav ? subbar() : ""}
        ${showFbaNav ? fbanav() : ""}
        <div class="page ${fullPage ? "full" : ""}" id="pageScroll">
          <div class="page-inner">${pageFn()}</div>
        </div>
        ${state.toast ? `<div class="toast" role="status">${esc(state.toast)}</div>` : ""}
      </div>`;
    if (App.pages[state.page + "After"]) App.pages[state.page + "After"]();
    if (state.menuOpen) {
      const m = el(slideMenu());
      if (m) root.appendChild(m);
    }
    if (state.modal) {
      const scrim = el(`<div class="modal-scrim"></div>`);
      scrim.appendChild(state.modal);
      scrim.addEventListener("mousedown", (e) => { if (e.target === scrim) closeModal(); });
      root.appendChild(scrim);
    }
    if (scrollTopBeforeRender != null && state.page === pageBeforeRender) {
      const scAfterRender = root.querySelector("#pageScroll");
      if (scAfterRender) scAfterRender.scrollTop = scrollTopBeforeRender;
    }
    renderHooks.forEach(fn => fn(state));
  }

  // ---- delegated dispatch ----
  const baseActions = {
    "goto": (ctx) => navigate(ctx.el.dataset.page),
    "goto-user-permissions": () => {
      state.userPermissionsTopTab = "management";
      state.userManagementTab = "employees";
      navigate("userPermissions");
    },
    "menu-toggle": () => { state.menuOpen = !state.menuOpen; if (!state.menuOpen) state.menuExpand = null; render(); },
    "menu-expand": (ctx) => { const s = ctx.el.dataset.sec; state.menuExpand = state.menuExpand === s ? null : s; render(); },
    "menu-noop": () => {},
    "settings-toggle": () => { state.settingsOpen = !state.settingsOpen; render(); },
    "nav-toggle": (ctx) => { const n = ctx.el.dataset.nav; state.openNav = state.openNav === n ? null : n; render(); },
    "close-modal": () => closeModal(),
    "inv-check": (ctx) => {
      const i = +ctx.el.dataset.i;
      if (state.selected.has(i)) state.selected.delete(i); else state.selected.add(i);
      render();
    },
    "inv-check-all": () => {
      if (state.selected.size === D.PRODUCTS.length) state.selected.clear();
      else D.PRODUCTS.forEach((_, i) => state.selected.add(i));
      render();
    },
    "send-fba": () => { if (state.selected.size) navigate("sendfc"); },
    "clear-sel": () => { state.selected.clear(); render(); },
  };

  function dispatch(name, ctx) {
    const fn = (App.actions && App.actions[name]) || baseActions[name];
    if (fn) fn(ctx);
  }

  function mount(rootEl) {
    root = rootEl;
    // click delegation
    root.addEventListener("click", (e) => {
      const t = e.target.closest("[data-act]");
      let closedRecommended = false;
      let closedSettings = false;
      let closedInviteActions = false;
      if (state.settingsOpen && !e.target.closest("[data-settings-root]")) {
        state.settingsOpen = false;
        closedSettings = true;
      }
      if (state.assistantInviteActionsOpen && !e.target.closest("[data-invite-actions-root]")) {
        state.assistantInviteActionsOpen = false;
        closedInviteActions = true;
      }
      if (state.recommendedOpen != null) {
        const raRoot = e.target.closest("[data-ra-root]");
        const clickedIndex = raRoot ? +raRoot.dataset.i : null;
        const actionName = t && t.dataset.act;
        const keepOpen = clickedIndex === state.recommendedOpen || actionName === "recommended-toggle";
        if (!keepOpen) {
          state.recommendedOpen = null;
          closedRecommended = true;
        }
      }
      if (!t || !root.contains(t)) {
        if (closedRecommended || closedSettings || closedInviteActions) render();
        return;
      }
      if (t.classList.contains("disabled")) {
        if (closedRecommended || closedSettings || closedInviteActions) render();
        return;
      }
      dispatch(t.dataset.act, { el: t, event: e });
      if (closedRecommended || closedSettings || closedInviteActions) render();
    });
    // input/change delegation
    root.addEventListener("input", (e) => {
      const t = e.target.closest("[data-input]");
      if (!t) return;
      const fn = (App.actions && App.actions["input:" + t.dataset.input]) ;
      if (fn) fn({ el: t, event: e, value: t.value });
    });
    root.addEventListener("change", (e) => {
      const t = e.target.closest("[data-change]");
      if (!t) return;
      const fn = (App.actions && App.actions["change:" + t.dataset.change]);
      if (fn) fn({ el: t, event: e, value: t.value });
    });
    render();
  }

  return {
    state, mount, render, navigate, el, esc,
    openModal, closeModal, showToast, onRender, setScenario,
    // Render target accessors — let the smoke harness render into an off-screen
    // node and restore the live mount afterward, without re-binding listeners.
    getRoot: function () { return root; },
    setRoot: function (el) { root = el; },
    reset: function () {
      state.page = "home"; state.openNav = null; state.menuOpen = false; state.menuExpand = null; state.settingsOpen = false;
      state.selected.clear(); state.groupOpen = false; state.recommendedOpen = null; state.modal = null; state.wizard = null; state.removal = null; state.fnskuLabels = null;
      state.toast = null; state.userPermissionsTopTab = "management"; state.userManagementTab = "employees"; state.openInvitationsTab = "authorisedPartners";
      state.assistantInviteCreated = false; state.assistantInviteActionsOpen = false; state.assistantPermissions = Object.assign({}, ASSISTANT_PERMISSION_DEFAULTS);
      state.assistantPermissionsTouched = false; state.assistantPermissionsSaved = false;
    },
    pages: {}, actions: Object.assign({}, baseActions),
    D,
  };
})();
