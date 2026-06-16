/* ============================================================
   Pages: Home, FBA Inventory, Shipments queue, AWD landing.
   Each registers a renderer into App.pages.

   TUTORIAL ANCHORS (public contract — do not rename without grepping
   console/tutorials/ first; a renamed/removed anchor silently breaks the
   spotlight and is caught by console/_smoke.js):
     data-tour="inventory-search" FBA Inventory search area
     data-tour="ck-{i}"          FBA Inventory row checkbox (per SKU index)
     data-tour="groupbar"        bottom group-action bar
     data-tour="group-action"    "Select group action" button
     data-tour="create-removal"  "Create removal order" item in the group-action menu
     data-tour="print-item-labels" "Print Item Labels" item in the group-action menu
     data-tour="send-fba"        "Send to FBA" item in the group-action menu
     data-tour="recommended-action-{i}" Recommended action split-button main area
     data-tour="recommended-action-caret-{i}" Recommended action menu caret
     data-tour="recommended-action-menu-{i}" Recommended action dropdown menu
     data-tour="recommended-action-print-labels-{i}" Print Item Labels row menu item
     data-tour="recommended-action-send-fba-{i}" Send to FBA row menu item
     data-tour="fnsku-*"         Print Labels for Individual Products demo window
     data-tour="fnsku-label-row-{i}" Print Labels modal SKU row
     data-tour="removal-*"       Create Removal Order flow anchors
     data-tour="settings-gear-button" Top Settings gear button
     data-tour="settings-user-permissions-menu-item" Settings menu User Permissions link
     data-tour="user-permissions-page" User Permissions demo wrapper
     data-tour="user-management-tab" Top User Management tab
     data-tour="open-invitations-tab" Top Open Invitations tab
     data-tour="authorised-partners-tab" Authorised Partners secondary tab
     data-tour="add-authorised-partner-button" Add Authorised Partner button
     data-tour="authorized-partner-invite-modal" Add partner invitation modal
     data-tour="copy-invitation-link-button" Copy demo invitation link button
     data-tour="close-invitation-modal-button" Close invitation modal button
     data-tour="fbabee-open-invitation-row" FBABEE open invitation row
     data-tour="fbabee-invitation-actions-button" Invitation row Actions button
     data-tour="accept-fbabee-invitation-menu-item" Accept invitation menu item
     data-tour="assistant-permissions-page" Assistant permission setup page
     data-tour="permission-awd-secondary-user-access-edit" Edit radio for AWD Secondary User Access
     data-tour="permission-fulfillment-programs-edit" Edit radio for Fulfillment Programs
     data-tour="permission-inventory-planning-edit" Edit radio for Inventory Planning
     data-tour="permission-inventory-performance-edit" Edit radio for Inventory performance
     data-tour="permission-manage-fba-inventory-shipments-edit" Edit radio for FBA inventory shipments
     data-tour="permissions-save-changes-button" Permission setup Save Changes button
     data-tour="shipments-menu-item" Main menu Shipments section
     data-tour="manage-shipments-menu-item" Main menu Manage Shipments link
     data-tour="manage-shipments-page" Manage Shipments page wrapper
     data-tour="shipping-queue-page" Shipping Queue content wrapper
     data-tour="shipment-id-search-input" Shipping Queue Shipment ID search field
     data-tour="shipment-id-search-button" Shipping Queue search button
     data-tour="demo-shipment-row" Searchable safe demo shipment row
     data-tour="demo-shipment-id-cell" Safe demo Shipment ID cell
     data-tour="demo-reference-id-cell" Safe demo Reference ID cell
     data-tour="shipment-search-empty-state" Safe empty search result
   ============================================================ */
(function () {
  const A = window.App, D = window.DATA, esc = A.esc;
  // Unified dropdown caret — matches the FBA sub-nav chevron (the "secondary menu" arrow)
  const DCARET = `<svg class="caret" viewBox="0 0 11 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l4.5 4.5L10 1"/></svg>`;
  const UCARET = `<svg class="caret up" viewBox="0 0 11 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l4.5 4.5L10 1"/></svg>`;

  /* ----------------------------- HOME -----------------------------
     The real home dashboard is heavily custom; for the sandbox it only
     serves as the backdrop behind the "open the menu" step, so we render
     a left/right split skeleton screen instead of mock content. */
  A.pages.home = function () {
    const sk = (w, h, extra) => `<div class="sk sk-line" style="width:${w};height:${h || 12}px;${extra || ""}"></div>`;
    const commItem = () => `<div class="sk-comm">
      ${sk("55%", 13)}
      ${sk("92%", 10, "margin-top:9px")}
      ${sk("28%", 9, "margin-top:8px")}
    </div>`;
    const tableRow = () => `<div class="sk-trow">
      <div class="sk sk-circle" style="width:42px;height:42px"></div>
      <div style="flex:1.7;min-width:0">${sk("60%", 13)}${sk("38%", 9, "margin-top:9px")}</div>
      <div class="sk sk-line" style="width:54px;height:11px"></div>
      <div class="sk sk-line" style="width:46px;height:11px"></div>
      <div class="sk sk-line" style="width:40px;height:11px"></div>
      <div class="sk sk-line" style="width:60px;height:11px"></div>
    </div>`;
    const recCardSk = () => `<div class="sk-reccard">
      ${sk("60%", 14)}
      <div class="sk" style="height:92px;border-radius:7px"></div>
      ${sk("100%", 10)}${sk("80%", 10, "margin-top:-2px")}
      <div class="sk" style="height:36px;border-radius:7px;margin-top:4px"></div>
    </div>`;

    return `
    <div class="page-inner" style="max-width:1240px;margin:0 auto;padding:0">
      <div class="home-skel">
        <!-- left rail -->
        <div class="sk-col">
          <div class="panel panel-pad sk-card">
            <div class="between">${sk("38%", 16)}<div class="sk sk-circle" style="width:22px;height:22px"></div></div>
            ${sk("60%", 11, "margin-top:16px")}
          </div>
          <div class="panel panel-pad sk-card">
            ${sk("48%", 16, "margin-bottom:6px")}
            ${commItem()}${commItem()}${commItem()}${commItem()}${commItem()}
          </div>
        </div>
        <!-- main column -->
        <div class="sk-col">
          <div class="panel panel-pad sk-card">
            <div class="between">${sk("26%", 16)}<div class="sk sk-circle" style="width:22px;height:22px"></div></div>
            <div class="row" style="gap:16px;margin-top:16px;align-items:stretch">
              <div class="sk" style="width:210px;height:88px;border-radius:8px"></div>
              <div class="sk" style="flex:1;height:88px;border-radius:8px"></div>
            </div>
          </div>
          <div class="panel panel-pad sk-card">
            <div class="between" style="margin-bottom:6px">
              <div>${sk("180px", 15)}${sk("90px", 10, "margin-top:8px")}</div>
              <div class="row" style="gap:8px">
                <div class="sk" style="width:96px;height:32px;border-radius:6px"></div>
                <div class="sk" style="width:150px;height:32px;border-radius:6px"></div>
              </div>
            </div>
            ${tableRow()}${tableRow()}
            <div class="between" style="margin-top:14px">${sk("70px", 11)}<div class="sk" style="width:180px;height:32px;border-radius:6px"></div></div>
          </div>
          <div class="panel panel-pad sk-card">
            ${sk("150px", 16, "margin-bottom:16px")}
            <div class="grid3">${recCardSk()}${recCardSk()}${recCardSk()}${recCardSk()}${recCardSk()}${recCardSk()}</div>
          </div>
        </div>
      </div>
    </div>`;
  };

  /* -------------------------- FBA INVENTORY -------------------------- */
  const AGE_BUCKETS = ["0-60", "61-90", "91-180", "181-330", "331-365", "366-455", "456+"];
  const ig = `<span class="ig">&#9432;</span>`;

  A.pages.inventory = function () {
    const sel = A.state.selected;
    const allOn = sel.size === D.PRODUCTS.length;
    const cols = "26px 1.5fr 66px 0.92fr 1.02fr 1.28fr 1.12fr 60px 0.92fr 148px";

    const rows = D.PRODUCTS.map((p, i) => {
      const on = sel.has(i);
      const fbaTotal = p.inbound + p.onhand + p.reserved + p.researching + p.unfulfillable;
      const stCls = p.health === "Healthy" ? "st-healthy"
        : p.health === "Low stock" ? "st-low"
        : p.health === "Out of stock" ? "st-out" : "st-excess";
      const deltaCls = p.sellDelta.trim().startsWith("-") ? "down" : "up";
      const ageRows = AGE_BUCKETS.map((b, k) =>
        `<div><span class="muted">${b}:</span> <span class="${p.age[k] ? "" : "muted"}" style="float:right">${p.age[k]}</span></div>`).join("");
      const action = recommendedAction(p, i);
      return `
      <div class="invrow" style="grid-template-columns:${cols}">
        <div class="ck ${on ? "on" : ""}" data-act="inv-check" data-i="${i}" data-tour="ck-${i}">${on ? "&#10003;" : ""}</div>
        <div class="prod">
          <div class="thumb"></div>
          <div style="min-width:0">
            <div class="pname">${esc(p.shortName)}</div>
            <div class="pmeta kvline">
              <div>Supplier: ${p.supplier ? `<b>${esc(p.supplier)}</b>` : "unassigned"}</div>
              <div>ASIN: ${p.asin}</div>
              <div>FNSKU: ${p.fnsku}</div>
              <div>SKU: ${p.sku}</div>
              <div>UPC/EAN: ${p.upc}</div>
              ${p.awd ? `<div style="margin-top:5px">AWD ${ig} ${p.awdNote}</div>` : ""}
            </div>
          </div>
        </div>
        <div class="sellthru">
          <div class="b">${p.sellThrough}</div>
          <div class="delta ${deltaCls}">${p.sellDelta}</div>
        </div>
        <div class="kvline">
          <div class="b">${p.sales}</div>
          <div class="muted">${p.salesUnits}</div>
        </div>
        <div class="kvline">
          <div>${p.fee} ${ig}</div>
          <div style="margin-top:8px" class="muted">Historical days<br>of supply: ${p.dos}</div>
        </div>
        <div class="kvline">
          <div>FBA <b style="float:right">${fbaTotal}</b></div>
          <div class="muted">Inbound <span style="float:right">${p.inbound}</span></div>
          <div class="muted">On-hand ${ig}<span style="float:right">${p.onhand}</span></div>
          <div class="muted">Reserved ${ig}<span style="float:right">${p.reserved}</span></div>
          <div class="muted">Researching <span style="float:right">${p.researching}</span></div>
          <div class="muted">Unfulfillable ${ig}<span style="float:right;color:var(--red)">${p.unfulfillable}</span></div>
        </div>
        <div class="kvline">
          <div>FBA <span class="${stCls}" style="float:right">${p.health}</span></div>
          <div class="muted">On-hand ${ig}<span style="float:right">${p.onhand}</span></div>
          <div class="muted">Recommended <span style="float:right">${p.recommended}</span></div>
          <div class="muted">min. level ${ig}<span style="float:right">DoS</span></div>
        </div>
        <div class="b">${p.excess}</div>
        <div class="kvline agecol">
          ${ageRows}
        </div>
        <div class="ra-cell${A.state.recommendedOpen === i ? " open" : ""}">${action}</div>
      </div>`;
    }).join("");

    const filters = ["Recommendation", "AWD Inventory", "Inbound", "Inventory age", "Storage type", "Product condition", "Incentive type", "Inventory health status", "Supplier", "Low-inventory-level fee", "Seasonality", "End of life"];
    return `
    <div class="titlerow">
      <div>
        <h1 class="page-title">FBA Inventory</h1>
        <p class="page-sub">Manage your FBA inventory in a single view</p>
      </div>
      <div class="row" style="gap:8px"><button class="btn dark sm split">Reports ${DCARET}</button><button class="btn dark sm split">Settings ${DCARET}</button></div>
    </div>
    <div class="invtabs">
      <div class="invtab on">All SKUs</div>
      <div class="invtab">Restock</div>
    </div>
    <div class="filterbar" style="margin-bottom:12px">
      <span class="lbl">Filters</span>
      ${filters.map(f => `<span class="fl">${f} ${DCARET}</span>`).join("")}
      <div style="flex-basis:100%;height:0"></div>
      <span style="color:var(--ink);font-weight:700">Selected filters</span> <a>Clear filters</a>
    </div>
    <div class="tbl-toolbar" style="padding-top:0">
      <div class="searchbox" data-tour="inventory-search"><input placeholder="Search by SKU, ASIN, or any product detail" readonly><button>Search</button></div>
      <span class="tiny muted" style="margin-left:auto;align-self:center">${D.PRODUCTS.length} results</span>
    </div>
    <div class="invtable pin-action">
      <div class="invhead" style="grid-template-columns:${cols}">
        <div class="ck ${allOn ? "on" : ""}" data-act="inv-check-all">${allOn ? "&#10003;" : ""}</div>
        <span>Product details<span class="info">&#8593; Sort by: SKU</span></span>
        <span>sell-through ${ig}<span class="info">Last 90 days</span></span>
        <span>Sales and forecast summary<span class="info">Last 90 days</span></span>
        <span>Low-inventory-level fee ${ig}<span class="info">Updated weekly</span></span>
        <span>Inventory overview ${ig}<span class="info">Units</span></span>
        <span>Inventory health status and recommendation ${ig}<span class="info">Units</span></span>
        <span>Estimated excess units ${ig}</span>
        <span>Inventory age<span class="info">Days</span></span>
        <span>Recommended action</span>
      </div>
      ${rows}
    </div>
    <div class="tbl-foot"><span class="pager"><span class="pg">&#8249;</span><span>1</span><span class="pg">&#8250;</span></span></div>
    ${groupBar()}`;
  };

  function recommendedAction(p, i) {
    const isSend = p.health === "Low stock";
    const label = isSend ? "Send to FBA" : "No action required";
    const open = A.state.recommendedOpen === i;
    const mainAct = isSend ? ` data-act="row-send" data-i="${i}"` : "";
    return `
      <div class="ra-wrap" data-ra-root data-i="${i}">
        <div class="ra-split${open ? " open" : ""}">
          <button class="ra-main" type="button"${mainAct} data-tour="recommended-action-${i}">${label}</button>
          <button class="ra-caret" type="button" data-act="recommended-toggle" data-i="${i}" data-tour="recommended-action-caret-${i}" aria-expanded="${open ? "true" : "false"}" aria-label="Open recommended action menu for row ${i + 1}">${DCARET}</button>
        </div>
        ${open ? recommendedActionMenu(i) : ""}
      </div>`;
  }

  function recommendedActionMenu(i) {
    const item = (label, act, tour) => `<button class="ra-item" type="button" data-act="${act || "recommended-close"}" data-i="${i}"${tour ? ` data-tour="${tour}-${i}"` : ""}>${label}</button>`;
    return `<div class="ra-menu" data-tour="recommended-action-menu-${i}">
      ${item("No action required")}
      ${item("Send to FBA", "row-send", "recommended-action-send-fba")}
      ${item("Create MCF fulfillment order")}
      ${item("Edit listing")}
      ${item("Improve keywords")}
      ${item("Create a Sponsored Products ad")}
      ${item("Lower price")}
      ${item("Create removal order", "recommended-removal")}
      ${item("SKU performance")}
      ${item("Print Item Labels", "recommended-print-labels", "recommended-action-print-labels")}
      ${item("Set replenishment alert")}
      ${item("Customize SKU settings")}
      ${item("Send to AWD")}
    </div>`;
  }

  function groupBar() {
    const n = A.state.selected.size;
    if (!n) return "";
    const open = A.state.groupOpen;
    return `
    <div class="groupbar" data-tour="groupbar">
      <span class="cancel" data-act="clear-sel">Cancel</span>
      <span class="sel">${n} item${n > 1 ? "s" : ""} selected</span>
      <div style="position:relative">
        <button class="ga" data-act="group-toggle" data-tour="group-action">Select group action ${UCARET}</button>
        ${open ? `<div class="dropdown open" style="bottom:46px;top:auto;min-width:220px">
          <div class="ditem" data-act="create-removal" data-tour="create-removal">Create removal order</div>
          <div class="ditem" data-act="print-item-labels" data-tour="print-item-labels">Print Item Labels</div>
          <div class="ditem disabled">Create sale</div>
          <div class="ditem" data-act="send-fba" data-tour="send-fba">Send to FBA</div>
        </div>` : ""}
      </div>
    </div>`;
  }

  // extra inventory actions
  A.actions["group-toggle"] = () => { A.state.recommendedOpen = null; A.state.groupOpen = !A.state.groupOpen; A.render(); };
  A.actions["row-send"] = (ctx) => { A.state.recommendedOpen = null; A.state.selected.add(+ctx.el.dataset.i); A.navigate("sendfc"); };
  A.actions["create-removal"] = () => { A.state.recommendedOpen = null; if (A.state.selected.size) A.navigate("removal"); };
  A.actions["recommended-toggle"] = (ctx) => {
    const i = +ctx.el.dataset.i;
    A.state.groupOpen = false;
    A.state.recommendedOpen = A.state.recommendedOpen === i ? null : i;
    A.render();
  };
  A.actions["recommended-close"] = () => { A.state.recommendedOpen = null; A.render(); };
  A.actions["recommended-removal"] = (ctx) => {
    A.state.recommendedOpen = null;
    A.state.selected.add(+ctx.el.dataset.i);
    A.navigate("removal");
  };
  A.actions["print-item-labels"] = () => {
    if (!A.state.selected.size) return;
    openFnskuPrintLabels(selectedInventoryIndexes());
  };
  A.actions["recommended-print-labels"] = (ctx) => {
    A.state.recommendedOpen = null;
    openFnskuPrintLabels([+ctx.el.dataset.i]);
  };
  A.actions["fnsku-print"] = () => {
    if (!A.state.fnskuLabels) A.state.fnskuLabels = { itemIndexes: [], qty: [] };
  };
  A.actions["fnsku-return"] = () => {
    A.state.groupOpen = false;
    A.state.fnskuLabels = null;
    A.closeModal();
  };
  A.actions["input:fnsku-qty"] = (ctx) => {
    if (!A.state.fnskuLabels) A.state.fnskuLabels = { itemIndexes: [], qty: [] };
    const i = +ctx.el.dataset.i;
    const next = Math.max(0, parseInt(ctx.value, 10) || 0);
    A.state.fnskuLabels.qty[i] = next;
    const win = ctx.el.closest(".fnsku-window");
    const total = win && win.querySelector("[data-fnsku-total]");
    if (total) total.textContent = String(fnskuTotal());
  };

  function selectedInventoryIndexes() {
    return D.PRODUCTS.map((_, i) => i).filter(i => A.state.selected.has(i));
  }

  function normalizeFnskuIndexes(indexes) {
    const seen = new Set();
    return (indexes || []).reduce((list, i) => {
      const n = +i;
      if (!Number.isInteger(n) || n < 0 || n >= D.PRODUCTS.length || seen.has(n)) return list;
      seen.add(n);
      list.push(n);
      return list;
    }, []);
  }

  function openFnskuPrintLabels(indexes) {
    const itemIndexes = normalizeFnskuIndexes(indexes);
    if (!itemIndexes.length) return;
    A.state.groupOpen = false;
    A.state.recommendedOpen = null;
    A.state.fnskuLabels = { itemIndexes, qty: itemIndexes.map(() => 1) };
    A.openModal(fnskuPrintWindow());
  }

  function fnskuState() {
    if (!A.state.fnskuLabels) A.state.fnskuLabels = { itemIndexes: [], qty: [] };
    A.state.fnskuLabels.itemIndexes = normalizeFnskuIndexes(A.state.fnskuLabels.itemIndexes);
    if (!Array.isArray(A.state.fnskuLabels.qty)) A.state.fnskuLabels.qty = [];
    A.state.fnskuLabels.itemIndexes.forEach((_, i) => {
      const n = parseInt(A.state.fnskuLabels.qty[i], 10);
      A.state.fnskuLabels.qty[i] = Number.isFinite(n) && n >= 0 ? n : 1;
    });
    A.state.fnskuLabels.qty = A.state.fnskuLabels.qty.slice(0, A.state.fnskuLabels.itemIndexes.length);
    return A.state.fnskuLabels;
  }

  function fnskuTotal() {
    const s = fnskuState();
    return s.itemIndexes.reduce((sum, _, i) => sum + (+s.qty[i] || 0), 0);
  }

  function fnskuPrintWindow() {
    const s = fnskuState();
    const rows = s.itemIndexes.map((productIndex, i) => {
      const p = D.PRODUCTS[productIndex];
      return `
      <div class="fnsku-tr fnsku-row" data-tour="fnsku-label-row-${i}">
        <div class="fnsku-sku">${esc(p.sku)}</div>
        <div class="fnsku-title">${esc(p.shortName || p.name)}</div>
        <div class="fnsku-qty">
          <input class="inp sm" type="number" min="0" step="1" value="${s.qty[i]}" data-input="fnsku-qty" data-i="${i}" data-tour="fnsku-label-qty-${i}" aria-label="Number of labels to print for ${esc(p.sku)}">
        </div>
      </div>`;
    }).join("");

    return A.el(`<div class="modal fnsku-window" data-tour="fnsku-print-window" role="dialog" aria-modal="true" aria-label="Print Labels for Individual Products">
      <div class="fnsku-chrome">
        <div class="fnsku-top">
          <button class="fnsku-menu" type="button" aria-label="Menu">&#9776;</button>
          <div class="fnsku-brand"><span>seller central</span></div>
          <div class="fnsku-market"><b>Demo USA</b><span>United States</span></div>
          <div class="fnsku-search"><input placeholder="Search" readonly><button type="button" aria-label="Search">&#9906;</button></div>
          <div class="fnsku-tools"><span>New Seller Central</span><span>EN</span><span>Help</span></div>
          <button class="fnsku-close" type="button" data-act="close-modal" aria-label="Close">x</button>
        </div>
        <div class="fnsku-sub"><span>Add Products</span><button type="button">Edit</button></div>
      </div>
      <div class="fnsku-page">
        <div class="fnsku-links">All Inventory View <span>|</span> Inventory Amazon Fulfills <span>|</span> Shipping Queue</div>
        <div class="fnsku-titlebar">
          <div>
            <h2>Print Labels for Individual Products</h2>
            <p>Specify the number of labels to print for each SKU and click the "Print Item Labels" button.</p>
          </div>
          <div class="fnsku-note"><b>Note:</b> You can return to this page to print more labels at any time.</div>
        </div>
        <div class="fnsku-table-wrap">
          <div class="fnsku-table">
            <div class="fnsku-tr fnsku-head">
              <div>Merchant SKU</div>
              <div>Title</div>
              <div>Number of labels to print</div>
            </div>
            ${rows}
            <div class="fnsku-tr fnsku-total">
              <div>Totals</div>
              <div></div>
              <div data-fnsku-total>${fnskuTotal()}</div>
            </div>
          </div>
        </div>
        <div class="fnsku-settings">
          <label>Choose printing format
            <select class="sel sm" data-tour="fnsku-format">
              <option selected>Standard formats</option>
              <option>Thermal label formats</option>
            </select>
          </label>
          <label>Paper/Sticker Type
            <select class="sel sm" data-tour="fnsku-sticker-type">
              <option selected>30-up labels 1&quot; x 2 5/8&quot; on US Letter</option>
              <option>40-up labels on US Letter</option>
            </select>
          </label>
          <button class="btn primary sm" type="button" data-act="fnsku-print" data-tour="fnsku-print-item-labels">Print Item Labels</button>
        </div>
        <div class="fnsku-footer">
          <button class="btn primary sm" type="button" data-act="fnsku-return" data-tour="fnsku-return-inventory">Return to Inventory List</button>
        </div>
      </div>
    </div>`);
  }

  A.applyFnskuLabelsScenario = function (s) {
    if (!s) {
      A.state.fnskuLabels = null;
      A.state.modal = null;
      return;
    }
    const itemIndexes = normalizeFnskuIndexes(s.itemIndexes || s.indexes || selectedInventoryIndexes());
    if (!itemIndexes.length) {
      A.state.fnskuLabels = null;
      A.state.modal = null;
      return;
    }
    const qtyDefault = "qtyDefault" in s ? s.qtyDefault : 1;
    const qty = Array.isArray(s.qty)
      ? itemIndexes.map((_, i) => {
          const n = parseInt(s.qty[i], 10);
          return Number.isFinite(n) && n >= 0 ? n : qtyDefault;
        })
      : itemIndexes.map(() => qtyDefault);
    A.state.groupOpen = false;
    A.state.recommendedOpen = null;
    A.state.fnskuLabels = { itemIndexes, qty };
    A.state.modal = fnskuPrintWindow();
  };

  /* ---------------- USER PERMISSIONS / AUTHORISED PARTNERS ---------------- */
  const INVITE_LINK = "sellercentral.amazon.example/invite/demo-token";

  function topTab(key, label, tour) {
    const on = A.state.userPermissionsTopTab === key;
    return `<button class="up-top-tab ${on ? "on" : ""}" type="button" data-act="up-top-tab" data-tab="${key}"${tour ? ` data-tour="${tour}"` : ""}>${label}</button>`;
  }

  function userPermissionsNav() {
    return `
    <div class="up-nav">
      <span class="up-crumb">User Permissions</span>
      <span class="up-arrow">&#8594;</span>
      ${topTab("management", "User Management", "user-management-tab")}
      ${topTab("addEmployee", "Add employee")}
      ${topTab("openInvitations", "Open invitations", "open-invitations-tab")}
    </div>`;
  }

  function subTab(group, key, label, tour) {
    const activeKey = group === "management" ? A.state.userManagementTab : A.state.openInvitationsTab;
    const on = activeKey === key;
    return `<button class="up-subtab ${on ? "on" : ""}" type="button" data-act="up-sub-tab" data-group="${group}" data-tab="${key}"${tour ? ` data-tour="${tour}"` : ""}>${label}</button>`;
  }

  A.pages.userPermissions = function () {
    const tab = A.state.userPermissionsTopTab || "management";
    let body = "";
    if (tab === "addEmployee") body = addEmployeePage();
    else if (tab === "openInvitations") body = openInvitationsPage();
    else body = userManagementPage();
    return `<div class="up-page" data-tour="user-permissions-page">${userPermissionsNav()}${body}</div>`;
  };

  function userManagementPage() {
    const sub = A.state.userManagementTab || "employees";
    return `
    <section class="up-shell">
      <div class="up-titleline">
        <div>
          <h1 class="up-title">Manage employees</h1>
          <p class="up-sub">Add, remove or update who can access your demo seller account.</p>
        </div>
        <div class="up-titlelinks"><a>Learn more</a><a>Take the Tour</a></div>
      </div>
      <div class="up-card">
        <div class="up-subtabs">
          ${subTab("management", "employees", "Employees")}
          ${subTab("management", "authorisedPartners", "Authorised Partners", "authorised-partners-tab")}
        </div>
        ${sub === "authorisedPartners" ? authorisedPartnersPanel() : employeesPanel()}
      </div>
    </section>`;
  }

  function employeesPanel() {
    return `
    <div class="up-toolbar">
      <div class="up-search"><input placeholder="Search" readonly><button type="button" aria-label="Search">&#9906;</button></div>
      <button class="btn primary sm" type="button">Add employee</button>
    </div>
    <div class="up-table">
      <div class="up-thead" style="grid-template-columns:1.3fr 1.4fr 1fr 0.8fr 86px">
        <span>Name</span><span>Email Address</span><span>Account Role</span><span>Status</span><span></span>
      </div>
      <div class="up-trow" style="grid-template-columns:1.3fr 1.4fr 1fr 0.8fr 86px">
        <a>Demo Owner</a><span>owner@example.com</span><span>Owner</span><span class="pill green">Active</span><button class="btn dark sm" type="button">View</button>
      </div>
    </div>
    ${upPager()}`;
  }

  function authorisedPartnersPanel() {
    return `
    <div class="up-toolbar">
      <div class="up-search"><input placeholder="Search" readonly><button type="button" aria-label="Search">&#9906;</button></div>
      <button class="btn primary sm" type="button" data-act="open-authorised-partner-modal" data-tour="add-authorised-partner-button">Add Authorised Partner</button>
    </div>
    <div class="up-table">
      <div class="up-thead" style="grid-template-columns:1fr 150px"><span>Name</span><span></span></div>
      <div class="up-empty-row" style="grid-template-columns:1fr 150px">
        <span>No authorised partner has been granted access in this demo yet.</span>
        <button class="btn dark sm" type="button">Edit</button>
      </div>
    </div>
    ${upPager()}`;
  }

  function addEmployeePage() {
    return `
    <section class="up-shell">
      <div class="up-titleline">
        <div>
          <h1 class="up-title">Add employee</h1>
          <p class="up-sub">This safe placeholder keeps the tab browseable without creating real users.</p>
        </div>
      </div>
      <div class="up-card up-form-card">
        <div class="fld"><label>Name</label><input class="inp" value="Demo Assistant" readonly></div>
        <div class="fld"><label>Email address</label><input class="inp" value="assistant@example.com" readonly></div>
        <button class="btn primary disabled" type="button">Send invitation</button>
      </div>
    </section>`;
  }

  function openInvitationsPage() {
    const sub = A.state.openInvitationsTab || "authorisedPartners";
    return `
    <section class="up-shell">
      <div class="up-titleline">
        <div>
          <h1 class="up-title">Open invites</h1>
          <p class="up-sub">Users that have been invited and have not created their account or need their email address confirmed will show up here.</p>
        </div>
        <div class="up-titlelinks"><a>Learn more</a></div>
      </div>
      <div class="up-card">
        <div class="up-subtabs">
          ${subTab("openInvitations", "users", "Users")}
          ${subTab("openInvitations", "authorisedPartners", "Authorised Partners", "authorised-partners-tab")}
        </div>
        ${sub === "authorisedPartners" ? authorisedPartnerInvitesPanel() : userInvitesPanel()}
      </div>
    </section>`;
  }

  function userInvitesPanel() {
    return `
    <div class="up-toolbar">
      <div class="up-search"><input placeholder="Search" readonly><button type="button" aria-label="Search">&#9906;</button></div>
    </div>
    <div class="up-table">
      <div class="up-thead" style="grid-template-columns:1fr 1fr 0.8fr"><span>Name</span><span>Email Address</span><span>Status</span></div>
      <div class="up-empty">No user invitations are open in this safe demo.</div>
    </div>
    ${upPager()}`;
  }

  function authorisedPartnerInvitesPanel() {
    const row = A.state.assistantInviteCreated ? `
      <div class="up-trow up-invite-row" style="grid-template-columns:1.2fr 1.2fr 0.7fr 170px" data-tour="fbabee-open-invitation-row">
        <span>FBABEE</span>
        <span>FBABEE</span>
        <span>Open</span>
        <div class="up-actions" data-invite-actions-root>
          <div class="ra-split ${A.state.assistantInviteActionsOpen ? "open" : ""}">
            <button class="ra-main" type="button" data-act="fbabee-invite-actions-toggle" data-tour="fbabee-invitation-actions-button">Actions</button>
            <button class="ra-caret" type="button" data-act="fbabee-invite-actions-toggle" aria-label="Open invitation actions">${DCARET}</button>
          </div>
          ${A.state.assistantInviteActionsOpen ? `<div class="up-action-menu">
            <button class="ra-item" type="button" data-act="accept-fbabee-invitation" data-tour="accept-fbabee-invitation-menu-item">Accept invitation</button>
            <button class="ra-item" type="button" data-act="reject-fbabee-invitation">Reject invitation</button>
          </div>` : ""}
        </div>
      </div>` : `<div class="up-empty">No authorised partner invitations are open yet. Use <b>Add Authorised Partner</b>, then copy the demo link to create the safe FBABEE invitation row.</div>`;
    return `
    <div class="up-toolbar">
      <div class="up-search"><input placeholder="Search" readonly><button type="button" aria-label="Search">&#9906;</button></div>
    </div>
    <div class="up-table">
      <div class="up-thead" style="grid-template-columns:1.2fr 1.2fr 0.7fr 170px"><span>Company</span><span>Sender Name</span><span>Status</span><span></span></div>
      ${row}
    </div>
    ${upPager()}`;
  }

  function upPager() {
    return `<div class="up-pager"><span>Page</span><span class="up-pagebox">1</span><span>of 1</span><button class="btn dark sm" type="button">Go</button><span class="sp"></span><button class="up-results" type="button">10 results per page ${DCARET}</button></div>`;
  }

  function authorisedPartnerInviteModal() {
    return A.el(`<div class="modal up-modal" role="dialog" aria-modal="true" aria-label="Send Invitation" data-tour="authorized-partner-invite-modal">
      <div class="modal-head">
        <h3>Send Invitation</h3>
        <span class="x" data-act="close-modal" aria-label="Close">&#10005;</span>
      </div>
      <div class="modal-body">
        <ol class="up-invite-steps">
          <li>
            <b>Copy the one-time invitation link.</b>
            <div class="up-copyline">
              <input class="inp" value="${INVITE_LINK}" readonly aria-label="Demo one-time invitation link">
              <button class="btn dark sm" type="button" data-act="copy-invite-link" data-tour="copy-invitation-link-button">Copy link</button>
            </div>
          </li>
          <li>Send this demo link to your service provider through your normal training channel.</li>
          <li>The provider will open the link and accept an invitation to your sandbox account.</li>
          <li>After accepting, you choose the limited demo permissions they need.</li>
        </ol>
      </div>
      <div class="modal-foot">
        <button class="btn primary sm" type="button" data-act="close-modal" data-tour="close-invitation-modal-button">Close</button>
      </div>
    </div>`);
  }
  A.assistantPartnerInviteModal = authorisedPartnerInviteModal;

  function permissionRows() {
    return [
      {
        id: "addProductsViaUpload",
        label: "Add Products via Upload",
        desc: "Upload a bulk product spreadsheet or text file in the safe demo.",
      },
      {
        id: "awdSecondaryUserAccess",
        label: "Amazon Warehousing and Distribution - Secondary User Access",
        desc: "Allow the partner to edit AWD-related secondary access settings in this sandbox.",
        editTour: "permission-awd-secondary-user-access-edit",
      },
      {
        id: "europeanExpansionAccelerator",
        label: "European Expansion Accelerator",
        desc: "Placeholder access for expansion recommendations in the demo account.",
      },
      {
        id: "fbaAnalytics",
        label: "FBA Analytics",
        desc: "View inventory and sales in a simplified visual dashboard.",
      },
      {
        id: "fbaDashboard",
        label: "FBA dashboard",
        desc: "View high-level FBA operational status in the demo.",
      },
      {
        id: "fulfillmentPrograms",
        label: "Fulfillment Programs",
        desc: "Allow edit access to fulfilment programme settings needed for assistant-account training.",
        editTour: "permission-fulfillment-programs-edit",
      },
      {
        id: "globalFbaInventory",
        label: "Global FBA Inventory",
        desc: "Placeholder row for global inventory visibility.",
      },
      {
        id: "imageManagement",
        label: "Image Management",
        desc: "Placeholder row for image update access.",
      },
      {
        id: "inboundPerformanceDashboard",
        label: "Inbound performance dashboard",
        desc: "Review inbound shipment risk and learning placeholders.",
      },
      {
        id: "inventoryPlanning",
        label: "Inventory Planning",
        desc: "Allow edit access to inventory planning tools used for replenishment and shipment preparation.",
        editTour: "permission-inventory-planning-edit",
      },
      {
        id: "inventoryPerformance",
        label: "Inventory performance",
        desc: "Allow edit access to inventory performance tools used to review operational health.",
        editTour: "permission-inventory-performance-edit",
      },
      {
        id: "itemClassificationGuide",
        label: "Item Classification Guide",
        desc: "Placeholder row for classification guidance.",
      },
      {
        id: "listByUploadingNonAmazonFile",
        label: "List by uploading Non-Amazon File",
        desc: "Upload a Non-Amazon file to pre-fill a demo listing template.",
      },
      {
        id: "manageFbaInventoryShipments",
        label: "Manage FBA Inventory/Shipments",
        desc: "Allow shipment-prep edits for FBA inventory workflows used in this demo.",
        editTour: "permission-manage-fba-inventory-shipments-edit",
      },
      {
        id: "manageFbaReturns",
        label: "Manage FBA returns",
        desc: "Placeholder row for return status review.",
      },
    ];
  }

  A.pages.assistantPermissions = function () {
    const touched = !!A.state.assistantPermissionsTouched;
    return `
    <div class="up-page assistant-perms" data-tour="assistant-permissions-page">
      <div class="up-nav">
        <span class="up-crumb">User Permissions</span>
        <span class="up-arrow">&#8594;</span>
        <button class="up-top-tab on" type="button">Edit User Permissions</button>
      </div>
      <section class="up-shell up-narrow">
        <div class="up-titleline">
          <div>
            <h1 class="up-title">Edit User Permissions</h1>
            <p class="up-sub">Managing limited demo access for FBABEE. Choose only the permissions needed for shipment support.</p>
          </div>
          <span class="pill blue">Safe sandbox</span>
        </div>
        <div class="up-note">This page is a simulation. It does not grant real Seller Central access and does not connect to Amazon.</div>
        <div class="up-card perm-card">
          <div class="perm-intro">
            <h2>Modify user permissions</h2>
            <p>Set each row independently. For assistant-account training, prefer the narrowest level that supports the task.</p>
          </div>
          ${permissionPlaceholderSections()}
          ${permissionSection("Inventory", permissionRows())}
        </div>
        ${A.state.assistantPermissionsSaved ? `<div class="up-save-note">Demo permission changes saved.</div>` : ""}
        <div class="perm-savebar">
          <button class="btn primary ${touched ? "" : "disabled"}" type="button" data-act="permissions-save" data-tour="permissions-save-changes-button">Save Changes</button>
        </div>
      </section>
    </div>`;
  };

  function permissionSection(title, rows) {
    return `
    <div class="perm-section">
      <div class="perm-head">
        <span>${esc(title)}</span><span>None</span><span>View</span><span>Edit</span><span>Admin</span>
      </div>
      ${rows.map(permissionRow).join("")}
    </div>`;
  }

  function permissionPlaceholderSections() {
    return `
    <div class="perm-prelude">
      ${permissionSkeletonSection("Advertising", ["Campaign manager", "Sponsored ads reports"])}
      ${permissionSkeletonSection("Growth", ["Growth opportunities", "Promotions and recommendations"])}
    </div>`;
  }

  function permissionSkeletonSection(title, lines) {
    const rows = lines.map((_, i) => `
      <div class="perm-skel-row">
        <span class="sk sk-line" style="width:${i ? "46%" : "58%"}"></span>
        <span class="sk sk-dot"></span>
        <span class="sk sk-dot"></span>
        <span class="sk sk-dot"></span>
        <span class="sk sk-dot"></span>
      </div>`).join("");
    return `
    <div class="perm-skel-section">
      <div class="perm-skel-head">
        <span>${esc(title)}</span><span>None</span><span>View</span><span>Edit</span><span>Admin</span>
      </div>
      ${rows}
    </div>`;
  }

  function permissionRow(row) {
    const value = A.state.assistantPermissions[row.id] || "none";
    const cell = (level) => {
      const on = value === level;
      const tour = level === "edit" && row.editTour ? ` data-tour="${row.editTour}"` : "";
      return `<button class="perm-radio" type="button" data-act="permission-select" data-perm="${row.id}" data-level="${level}" aria-label="${esc(row.label)} ${level}"${tour}><span class="radio ${on ? "on" : ""}"></span></button>`;
    };
    return `
    <div class="perm-row">
      <div class="perm-name"><b>${esc(row.label)}</b><span>${esc(row.desc)}</span></div>
      ${cell("none")}
      ${cell("view")}
      ${cell("edit")}
      ${cell("admin")}
    </div>`;
  }

  Object.assign(A.actions, {
    "up-top-tab": (ctx) => {
      const tab = ctx.el.dataset.tab;
      A.state.userPermissionsTopTab = tab;
      if (tab === "management" && !A.state.userManagementTab) A.state.userManagementTab = "employees";
      if (tab === "openInvitations") A.state.openInvitationsTab = "authorisedPartners";
      A.state.assistantInviteActionsOpen = false;
      A.render();
    },
    "up-sub-tab": (ctx) => {
      const group = ctx.el.dataset.group;
      const tab = ctx.el.dataset.tab;
      if (group === "management") A.state.userManagementTab = tab;
      else A.state.openInvitationsTab = tab;
      A.state.assistantInviteActionsOpen = false;
      A.render();
    },
    "open-authorised-partner-modal": () => {
      A.openModal(authorisedPartnerInviteModal());
    },
    "copy-invite-link": () => {
      A.state.assistantInviteCreated = true;
      A.showToast("Demo invitation link copied.");
    },
    "fbabee-invite-actions-toggle": () => {
      A.state.assistantInviteActionsOpen = !A.state.assistantInviteActionsOpen;
      A.render();
    },
    "accept-fbabee-invitation": () => {
      A.state.assistantInviteActionsOpen = false;
      A.navigate("assistantPermissions");
    },
    "reject-fbabee-invitation": () => {
      A.state.assistantInviteActionsOpen = false;
      A.state.assistantInviteCreated = false;
      A.showToast("Demo invitation rejected.");
    },
    "permission-select": (ctx) => {
      A.state.assistantPermissions[ctx.el.dataset.perm] = ctx.el.dataset.level;
      A.state.assistantPermissionsTouched = true;
      A.state.assistantPermissionsSaved = false;
      A.render({ preservePageScroll: true });
    },
    "permissions-save": () => {
      if (!A.state.assistantPermissionsTouched) return;
      A.state.assistantPermissionsSaved = true;
      A.showToast("Demo permission changes saved.", { preservePageScroll: true });
    },
  });

  /* ---------------------- CREATE REMOVAL ORDER ---------------------- */
  A.initRemoval = function () {
    let skus = [...A.state.selected];
    if (!skus.length) skus = [4];
    skus = skus.slice(0, 3).sort((a, b) => a - b);
    const qty = {};
    skus.forEach(i => { qty[i] = i === 4 ? 24 : Math.min(D.PRODUCTS[i].onhand, 12); });
    A.state.removal = {
      skus,
      openStep: 1,
      done: {},
      method: null,
      addressId: D.ADDRESSES[0].id,
      addressConfirmed: false,
      submitted: false,
      qty,
    };
  };

  A.applyRemovalScenario = function (r, s) {
    if (!r) return;
    if ("skus" in s) {
      r.skus = (s.skus || []).slice(0, 3).sort((a, b) => a - b);
      r.skus.forEach(i => { if (!(+r.qty[i] > 0)) r.qty[i] = i === 4 ? 24 : Math.min(D.PRODUCTS[i].onhand, 12); });
    }
    if ("qty" in s) Object.assign(r.qty, s.qty);
    if ("done" in s) { r.done = {}; (s.done || []).forEach(n => { r.done[n] = true; }); }
    if ("openStep" in s) r.openStep = s.openStep;
    if ("method" in s) r.method = s.method;
    if ("addressId" in s) r.addressId = s.addressId;
    if ("addressConfirmed" in s) r.addressConfirmed = s.addressConfirmed;
    if ("submitted" in s) r.submitted = s.submitted;
  };

  function R() {
    if (!A.state.removal) A.initRemoval();
    return A.state.removal;
  }
  function removalAddr() {
    return D.ADDRESSES.find(a => a.id === R().addressId) || D.ADDRESSES[0];
  }
  function removalTotals() {
    const r = R();
    return r.skus.reduce((out, i) => {
      out.units += +r.qty[i] || 0;
      out.skus += 1;
      return out;
    }, { skus: 0, units: 0 });
  }
  function removalMethodLabel() {
    const r = R();
    if (r.method === "dispose") return "Dispose";
    if (r.method === "liquidate") return "Liquidate";
    return r.method === "return" ? "Return to address" : "Not selected";
  }
  function rmStepShell(n, title, isOpen, isDone, summary, body) {
    return `
    <div class="step ${isOpen ? "" : "collapsed"}">
      <div class="step-bar">
        ${isDone ? `<span class="check">&#10003;</span>` : ""}
        <span class="stepn">Step ${n}: ${title}</span>
        ${isDone && summary ? `<span class="summ">${summary}</span>` : ""}
        <span class="sp">${isDone ? `<a data-act="rm-open" data-step="${n}">View / edit</a>` : ""}</span>
      </div>
      ${isOpen ? `<div class="step-body">${body}</div>` : ""}
    </div>`;
  }

  A.pages.removal = function () {
    const r = R();
    return `
    <div class="wf-head rm-head">
      <div>
        <h1 class="page-title" style="font-size:28px">Create removal order</h1>
        <p class="page-sub">Remove sellable or unsellable FBA inventory by returning, disposing, or liquidating selected units.</p>
      </div>
      <div class="wf-meta"><span class="pill blue">Safe sandbox</span><span>No real account or inventory is affected</span></div>
    </div>
    ${r.submitted ? removalDone() : ""}
    ${removalChooseInventory()}
    ${removalMethod()}
    ${removalAddress()}
    ${removalReview()}`;
  };

  function removalChooseInventory() {
    const r = R(), t = removalTotals();
    const open = r.openStep === 1, done = !!r.done[1];
    const cols = "1.7fr 110px 120px 130px";
    const rows = r.skus.map(i => {
      const p = D.PRODUCTS[i];
      const qty = +r.qty[i] || 0;
      return `
      <div class="invrow" style="grid-template-columns:${cols}">
        <div class="prod">
          <div class="thumb"></div>
          <div style="min-width:0">
            <div class="pname">${esc(p.shortName)}</div>
            <div class="pmeta kvline"><div>SKU: ${p.sku}</div><div>ASIN: ${p.asin}</div><div>FNSKU: ${p.fnsku}</div></div>
          </div>
        </div>
        <div class="kvline"><div class="b">${p.onhand}</div><div class="muted">Available</div></div>
        <div class="kvline"><div class="b">${p.unfulfillable}</div><div class="muted">Unsellable</div></div>
        <div class="fld"><label>Units</label><input class="inp sm" data-input="rm-qty" data-i="${i}" value="${qty}" data-tour="removal-qty-${i}"></div>
      </div>`;
    }).join("");
    const body = `
      <div class="banner teal" data-tour="removal-safe">This sandbox creates a training-only removal order. Use real removal orders only after checking inventory status, stranded issues, and disposal/return cost rules.</div>
      <div class="invtable rm-table" data-tour="removal-inventory">
        <div class="invhead" style="grid-template-columns:${cols}">
          <span>Selected inventory</span><span>Sellable units</span><span>Unsellable units</span><span>Units to remove</span>
        </div>
        ${rows}
      </div>
      <div class="between mt16">
        <span class="small muted">Selected: <b>${t.skus}</b> SKU${t.skus > 1 ? "s" : ""} / <b>${t.units}</b> units</span>
        <button class="btn primary" data-act="rm-confirm1" data-tour="removal-confirm-inventory">Confirm inventory</button>
      </div>`;
    return rmStepShell(1, "Choose inventory", open, done, `${t.skus} SKU${t.skus > 1 ? "s" : ""} / ${t.units} units`, body);
  }

  function removalMethod() {
    const r = R();
    const open = r.openStep === 2, done = !!r.done[2];
    const methods = [
      { id: "return", title: "Return to address", body: "Ship units back to your warehouse or prep partner for inspection, relabeling, or resale outside FBA." },
      { id: "dispose", title: "Dispose", body: "Ask the fulfillment center to dispose of units that should not be returned to inventory." },
      { id: "liquidate", title: "Liquidate", body: "Recover partial value through liquidation when available for the selected units." },
    ].map(m => `
      <div class="rm-method${r.method === m.id ? " on" : ""}" data-act="rm-method" data-method="${m.id}" data-tour="removal-method-${m.id}">
        <span class="radio ${r.method === m.id ? "on" : ""}"></span>
        <div>
          <div class="b small">${m.title}</div>
          <div class="tiny muted mt8">${m.body}</div>
        </div>
      </div>`).join("");
    const body = `
      <div class="small muted" style="margin-bottom:14px">Choose the removal method that matches the business reason for taking units out of FBA.</div>
      <div class="rm-method-grid">${methods}</div>`;
    return rmStepShell(2, "Select removal method", open, done, removalMethodLabel(), body);
  }

  function removalAddress() {
    const r = R(), a = removalAddr();
    const open = r.openStep === 3, done = !!r.done[3];
    const body = `
      <div class="rm-address" data-tour="removal-address">
        <div>
          <div class="b small">Return-to address</div>
          <div class="rm-addr-name">${esc(a.company)} / ${esc(a.name)}</div>
          <div class="small muted rm-addr-lines">${esc(a.street)}<br>${esc(a.city)}, ${esc(a.state)} ${esc(a.zip)}<br>${esc(a.country)} · ${esc(a.phone)}</div>
        </div>
        <span class="pill blue">Default address</span>
      </div>
      <div class="between mt16">
        <span class="small muted">For return orders, confirm that this address can receive FBA returns and has a contact available.</span>
        <button class="btn primary ${r.method ? "" : "disabled"}" data-act="rm-confirm-address" data-tour="removal-confirm-address">Use this return address</button>
      </div>`;
    return rmStepShell(3, "Confirm address", open, done, r.addressConfirmed ? "Return address confirmed" : "", body);
  }

  function removalReview() {
    const r = R(), t = removalTotals();
    const open = r.openStep === 4, done = !!r.done[4];
    const disabled = r.addressConfirmed ? "" : "disabled";
    const rows = [
      ["Removal method", removalMethodLabel()],
      ["Return address", removalAddr().oneLine],
      ["Selected inventory", `${t.skus} SKU${t.skus > 1 ? "s" : ""}, ${t.units} units`],
      ["Estimated processing", "10-14 business days after the order is accepted"],
    ].map(([k, v]) => `<div class="rm-review-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("");
    const body = `
      <div class="rm-review" data-tour="removal-review">${rows}</div>
      <div class="rm-note mt16">Review removal fees and destination details before submitting a real order. This demo submit button only completes the sandbox flow.</div>
      <div class="between mt16">
        <span></span>
        <button class="btn primary ${disabled}" data-act="rm-submit" data-tour="removal-submit">Submit removal order</button>
      </div>`;
    return rmStepShell(4, "Review and submit", open, done, r.submitted ? "Submitted" : "", body);
  }

  function removalDone() {
    return `
    <div class="rm-done" data-tour="removal-done">
      <div class="seal">&#10003;</div>
      <div>
        <div class="b">Removal order submitted</div>
        <div class="small muted mt8">Sandbox order RMV-2026-0608 is now ready for tracking. In a real workflow, monitor status until units are returned, disposed, or liquidated.</div>
      </div>
    </div>`;
  }

  Object.assign(A.actions, {
    "input:rm-qty": (ctx) => {
      const i = +ctx.el.dataset.i;
      const v = ctx.value.replace(/[^0-9]/g, "");
      R().qty[i] = v ? +v : 0;
      A.render();
    },
    "rm-open": (ctx) => { R().openStep = +ctx.el.dataset.step; A.render(); },
    "rm-confirm1": () => { R().done[1] = true; R().openStep = 2; A.render(); },
    "rm-method": (ctx) => { R().method = ctx.el.dataset.method; R().done[2] = true; R().openStep = 3; A.render(); },
    "rm-confirm-address": () => { if (!R().method) return; R().addressConfirmed = true; R().done[3] = true; R().openStep = 4; A.render(); },
    "rm-submit": () => { if (!R().addressConfirmed) return; R().submitted = true; R().done[4] = true; A.render(); },
  });

  /* -------------------------- SHIPMENTS QUEUE -------------------------- */
  A.pages.shipments = function () {
    // Safe placeholder shipment data only. No real Seller Central account data.
    // [name, shipmentId, referenceId, created, createdTime, updated, updatedTime, shipTo, deliveryWin, skus, units, located, status, work, demo]
    const sh = [
      ["FBA Demo Shipment A", "FBA-DEMO-SHIP-001", "REF-DEMO-001", "Jun 10, 2026", "9:15 AM", "Jun 11, 2026", "4:42 PM", "Demo fulfillment center", "Jul 14 - Jul 20, 2026", 2, 48, "0, 0", "Working", true, true],
      ["FBA Demo Shipment B", "SAMPLE-DEMO-002", "REF-DEMO-002", "Apr 9, 2026", "11:01 AM", "Jun 6, 2026", "1:25 PM", "Demo fulfillment center", "Jun 7 - Jun 13, 2026", 4, 40, "40, 40", "Closed", false, false],
      ["FBA Demo Shipment C", "SAMPLE-DEMO-003", "REF-DEMO-003", "Jun 6, 2026", "1:03 PM", "Jun 6, 2026", "1:10 PM", "Demo fulfillment center", "Jun 7 - Jun 13, 2026", 1, 1, "0, 0", "Shipped", false, false],
      ["FBA Demo Shipment D", "SAMPLE-DEMO-004", "REF-DEMO-004", "Jun 6, 2026", "1:03 PM", "Jun 6, 2026", "1:10 PM", "Demo fulfillment center", "Jun 7 - Jun 13, 2026", 1, 2, "0, 0", "Shipped", false, false],
      ["FBA Demo Shipment E", "SAMPLE-DEMO-005", "REF-DEMO-005", "May 22, 2026", "8:33 PM", "Jun 6, 2026", "10:49 AM", "Demo fulfillment center", "Jun 21 - Jun 27, 2026", 5, 31, "0, 0", "In transit", false, false],
      ["FBA Demo Shipment F", "SAMPLE-DEMO-006", "REF-DEMO-006", "Apr 23, 2026", "11:41 AM", "Jun 6, 2026", "7:03 AM", "Demo fulfillment center", "May 24 - May 30, 2026", 5, 21, "21, 20", "Closed", false, false],
      ["FBA Demo Shipment G", "SAMPLE-DEMO-007", "REF-DEMO-007", "Apr 9, 2026", "11:01 AM", "Jun 6, 2026", "3:18 AM", "Demo fulfillment center", "May 31 - Jun 6, 2026", 4, 40, "40, 7", "Receiving", false, false],
      ["FBA Demo Shipment H", "SAMPLE-DEMO-008", "REF-DEMO-008", "Jun 5, 2026", "11:56 AM", "Jun 5, 2026", "12:02 PM", "Demo fulfillment center", "Jul 12 - Jul 18, 2026", 3, 21, "0, 0", "Working", true, false],
      ["FBA Demo Shipment I", "SAMPLE-DEMO-009", "REF-DEMO-009", "Jun 5, 2026", "11:56 AM", "Jun 5, 2026", "12:02 PM", "Demo fulfillment center", "Jul 12 - Jul 18, 2026", 5, 27, "0, 0", "Working", true, false],
      ["FBA Demo Shipment J", "SAMPLE-DEMO-010", "REF-DEMO-010", "Jun 5, 2026", "11:56 AM", "Jun 5, 2026", "12:02 PM", "Demo fulfillment center", "Jul 12 - Jul 18, 2026", 5, 28, "0, 0", "Working", true, false],
      ["FBA Demo Shipment K", "SAMPLE-DEMO-011", "REF-DEMO-011", "Jun 5, 2026", "6:17 AM", "Jun 5, 2026", "6:23 AM", "Demo fulfillment center", "Jun 7 - Jun 13, 2026", 1, 2, "0, 0", "Shipped", false, false],
    ];
    const cols = "1.95fr 96px 100px 1.15fr 56px 1.05fr 92px 150px";
    const draft = A.state.shipmentSearchDraft || "";
    const query = (A.state.shipmentSearchQuery || "").trim().toUpperCase();
    const filtered = A.state.shipmentSearchSubmitted && query
      ? sh.filter(s => String(s[1]).toUpperCase() === query)
      : sh;
    const rows = filtered.map(s => {
      const [name, shipmentId, referenceId, created, createdT, updated, updatedT, shipTo, win, skus, units, located, status, work, demo] = s;
      const nextBtn = work
        ? `<div class="split-btn"><button class="btn primary sm main" data-act="goto" data-page="sendfc">Work on shipment</button><button class="btn primary sm more">${DCARET}</button></div>`
        : `<div class="split-btn"><button class="btn dark sm main">Track shipment</button><button class="btn dark sm more">${DCARET}</button></div>`;
      const rowTour = demo ? ` data-tour="demo-shipment-row"` : "";
      const shipmentTour = demo ? ` data-tour="demo-shipment-id-cell"` : "";
      const referenceTour = demo ? ` data-tour="demo-reference-id-cell"` : "";
      return `
      <div class="invrow" style="grid-template-columns:${cols}"${rowTour}>
        <div><a>${esc(name)}</a><div class="sub-time"${shipmentTour}>Shipment ID: ${esc(shipmentId)}</div><div class="sub-time"${referenceTour}>Reference ID: ${esc(referenceId)}</div></div>
        <div>${created}<div class="sub-time">${createdT}</div></div>
        <div>${updated}<div class="sub-time">${updatedT}</div></div>
        <div><b>${shipTo}</b><div class="sub-time">Delivery window ${win}</div></div>
        <div><a>${skus}</a></div>
        <div><b>${units}</b><a class="units-link">${located}</a></div>
        <div class="b">${status}</div>
        <div>${nextBtn}</div>
      </div>`;
    }).join("");
    const empty = A.state.shipmentSearchSubmitted && query && !filtered.length
      ? `<div class="sh-empty" data-tour="shipment-search-empty-state">
          <div class="sh-empty-ic">&#9906;</div>
          <div>
            <b>No matching shipment found</b>
            <p>Check the Shipment ID and search again. This demo uses safe placeholder shipment data only.</p>
          </div>
        </div>`
      : "";
    return `
    <div class="shipments-page" data-tour="manage-shipments-page">
      <div data-tour="shipping-queue-page">
        <div class="titlerow">
          <div>
            <h1 class="page-title">Shipping Queue</h1>
            <p class="page-sub">This page provides details on all the shipments you are working on and those you have sent to Amazon.</p>
          </div>
          <div class="country-switch">
            <div>
              <div class="cs-label">Change country/region <span class="cs-new">New</span></div>
              <div class="cs-val">Disabled</div>
            </div>
            <div class="cs-ic">
              <svg class="cs-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"></path></svg>
              <span class="cs-caret">&#9662;</span>
            </div>
          </div>
        </div>
        <div class="shtabs">
          <div class="shtab on">Fulfillment center shipments <span class="ig">&#9432;</span></div>
          <div class="shtab">Amazon distribution center shipments <span class="ig">&#9432;</span></div>
        </div>
        <div class="shfilter">
          <button class="btn dark sm">Filters</button>
          <label class="sw-toggle"><span class="sw"></span> Missing tracking information only</label>
          <select class="sel sm"><option>Last updated</option><option>Created</option></select>
          <select class="sel sm"><option>Status</option><option>Working</option><option>Shipped</option><option>Closed</option></select>
          <span class="export grow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"></path></svg> Export table data</span>
          <div class="searchbox sm">
            <input placeholder="Search by shipment ID" value="${esc(draft)}" data-input="shipment-id-search" data-tour="shipment-id-search-input" aria-label="Search by Shipment ID">
            <button type="button" data-act="shipment-search" data-tour="shipment-id-search-button">Search</button>
          </div>
        </div>
        <div class="invtable">
          <div class="invhead" style="grid-template-columns:${cols}">
            <span>Shipment name<span class="info">Shipment ID, Reference ID</span></span>
            <span class="sortlink">Created</span>
            <span><span class="sorted">Last updated &#9662;</span></span>
            <span>Ship to</span>
            <span>SKUs</span>
            <span>Expected units ${ig}<span class="info">Located units, Prime eligible units</span></span>
            <span>Status</span>
            <span>Next steps</span>
          </div>
          ${rows}
          ${empty}
        </div>
        <div class="tbl-foot"><span>Page 1</span><a>Next &#8250;</a></div>
      </div>
    </div>`;
  };

  A.actions["input:shipment-id-search"] = (ctx) => {
    A.state.shipmentSearchDraft = ctx.value;
  };
  A.actions["shipment-search"] = (ctx) => {
    const input = ctx.el.closest(".searchbox")?.querySelector("input");
    const value = (input ? input.value : A.state.shipmentSearchDraft || "").trim();
    A.state.shipmentSearchDraft = value;
    A.state.shipmentSearchQuery = value;
    A.state.shipmentSearchSubmitted = true;
    A.render({ preservePageScroll: true });
  };

  /* ----------------------------- AWD ----------------------------- */
  A.pages.awd = function () {
    return `
    <div class="panel" style="background:linear-gradient(180deg,#e7f1fa,#fff);border:1px solid var(--line);padding:36px 34px;margin-bottom:20px">
      <h1 class="page-title" style="font-size:26px">Warehousing and Distribution (AWD)</h1>
      <p class="page-sub" style="max-width:560px">Take advantage of integrated bulk storage and distribution solutions for your business.</p>
      <button class="btn primary mt16" data-act="goto" data-page="sendfc">Send to Amazon</button>
    </div>
    <div class="b" style="font-size:16px;margin-bottom:12px">Quick actions</div>
    <div class="grid3">
      ${awdCard("Send inventory to AWD", "Create a shipment to send from your supplier to our warehouses.", "Send to AWD")}
      ${awdCard("Manage stored inventory", "Check the status of your current inventory in our warehouses.", "View inventory")}
      ${awdCard("Move from storage", "Replenish to FBA or move inventory to other channels.", "Move inventory")}
    </div>
    <div class="panel panel-pad mt20">
      <div class="b" style="font-size:15px;margin-bottom:6px">Why AWD?</div>
      <div class="grid3 mt12">
        ${awdBenefit("Save on bulk storage", "Pay as you go, with available discounts and no seasonal surcharges.")}
        ${awdBenefit("Simplify your operations", "Automated transportation and replenishment from AWD to FBA.")}
        ${awdBenefit("Distribute beyond FBA", "Send to other sales channels from a single pool of AWD inventory.")}
      </div>
    </div>`;
  };
  function awdCard(t, b, cta) {
    return `<div class="card" style="gap:10px">
      <div style="height:90px;border-radius:7px;background:repeating-linear-gradient(135deg,#eef1f1,#eef1f1 8px,#f6f8f8 8px,#f6f8f8 16px)"></div>
      <div class="b" style="font-size:14.5px">${t}</div>
      <div class="small muted" style="line-height:1.5;min-height:42px">${b}</div>
      <button class="btn ghost sm">${cta}</button>
    </div>`;
  }
  function awdBenefit(t, b) {
    return `<div><div class="b small">${t}</div><div class="tiny muted mt8" style="line-height:1.6">${b}</div></div>`;
  }
})();
