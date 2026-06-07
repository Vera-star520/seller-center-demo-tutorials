/* ============================================================
   Console core: state, chrome (top bar / sub bar / FBA nav),
   page router, modal system, and a delegated action dispatch.
   Pages and the Send-to-FC wizard register into App.pages / App.actions.
   ============================================================ */
window.App = (function () {
  const D = window.DATA;

  const state = {
    page: "home",
    openNav: null,                 // 'inventory' | 'shipments' | null
    menuOpen: false,               // hamburger slide menu
    menuExpand: null,              // expanded section in slide menu
    selected: new Set(),           // selected SKU indices on FBA Inventory
    modal: null,                   // {render: fn} or null
    wizard: null,                  // created when entering Send to FC
  };

  // ---- tiny helpers ----
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  // ---- chrome ----
  function slideMenu() {
    if (!state.menuOpen) return "";
    const bm = `<svg class="sm-bm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4V3z"/></svg>`;
    const item = (label, sub) => `
      <div class="sm-item ${sub ? "has-fly" : "disabled"}" data-act="menu-noop">
        <span>${label}</span><span class="ch"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></span>
        ${sub ? `<div class="sm-fly">
          <div class="sm-link disabled"><span>Manage All Inventory</span>${bm}</div>
          <div class="sm-shead">Fulfillment by Amazon (FBA)</div>
          <div class="sm-link" data-act="goto" data-page="inventory"><span>FBA Inventory</span>${bm}</div>
          <div class="sm-link" data-act="goto" data-page="shipments"><span>Shipments</span>${bm}</div>
          <div class="sm-link" data-act="goto" data-page="awd"><span>Warehousing and distribution (AWD)</span>${bm}</div>
        </div>` : ""}
      </div>`;
    return `
    <div class="sm-scrim" data-act="menu-toggle">
      <div class="sm-panel" data-act="menu-noop">
        <div class="sm-top"><span class="x" data-act="menu-toggle">&#10005;</span><b>Menu</b></div>
        ${item("Catalog")}
        ${item("Inventory", true)}
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
      <div class="burger" data-act="menu-toggle">&#9776;</div>
      <div class="brand" data-act="goto" data-page="home">
        <span class="logo">Seller Central</span>
      </div>
      <div class="store-pill"><b>${esc(D.STORE.name)}</b><span class="div"></span>${esc(D.STORE.country)}</div>
      <div class="topsearch"><input placeholder="Search" readonly><button>&#9906;</button></div>
      <div class="topright">
        <span class="ic">&#9881;</span><span>EN &#9662;</span><span>Help</span>
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
    const on = (p) => ["inventory", "sendfc"].includes(state.page) && p === "inv" || (state.page === "shipments" && p === "shp");
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

  // ---- navigation ----
  function navigate(page) {
    state.page = page;
    state.openNav = null;
    state.menuOpen = false;
    state.menuExpand = null;
    if (page === "sendfc" && !state.wizard) App.initWizard();
    render();
  }

  // ---- render ----
  let root = null;
  const renderHooks = [];
  function onRender(fn) { renderHooks.push(fn); }

  function render() {
    if (!root) return;
    const showFbaNav = ["inventory", "shipments", "sendfc", "awd"].includes(state.page);
    const pageFn = App.pages[state.page] || App.pages.home;
    root.innerHTML = `
      <div class="console">
        ${topbar()}
        ${showFbaNav ? subbar() : ""}
        ${showFbaNav ? fbanav() : ""}
        <div class="page ${state.page === "sendfc" || state.page === "inventory" ? "full" : ""}" id="pageScroll">
          <div class="page-inner">${pageFn()}</div>
        </div>
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
    renderHooks.forEach(fn => fn(state));
  }

  // ---- delegated dispatch ----
  const baseActions = {
    "goto": (ctx) => navigate(ctx.el.dataset.page),
    "menu-toggle": () => { state.menuOpen = !state.menuOpen; if (!state.menuOpen) state.menuExpand = null; render(); },
    "menu-expand": (ctx) => { const s = ctx.el.dataset.sec; state.menuExpand = state.menuExpand === s ? null : s; render(); },
    "menu-noop": () => {},
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
      if (!t || !root.contains(t)) return;
      if (t.classList.contains("disabled")) return;
      dispatch(t.dataset.act, { el: t, event: e });
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
    openModal, closeModal, onRender,
    reset: function () {
      state.page = "home"; state.openNav = null; state.menuOpen = false; state.menuExpand = null;
      state.selected.clear(); state.groupOpen = false; state.modal = null; state.wizard = null;
    },
    pages: {}, actions: Object.assign({}, baseActions),
    D,
  };
})();
