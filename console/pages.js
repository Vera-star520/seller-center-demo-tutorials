/* ============================================================
   Pages: Home, FBA Inventory, Shipments queue, AWD landing.
   Each registers a renderer into App.pages.

   TUTORIAL ANCHORS (public contract — do not rename without grepping
   console/tutorials/ first; a renamed/removed anchor silently breaks the
   spotlight and is caught by console/_smoke.js):
     data-tour="ck-{i}"          FBA Inventory row checkbox (per SKU index)
     data-tour="groupbar"        bottom group-action bar
     data-tour="group-action"    "Select group action" button
     data-tour="create-removal"  "Create removal order" item in the group-action menu
     data-tour="send-fba"        "Send to FBA" item in the group-action menu
     data-tour="removal-*"       Create Removal Order flow anchors
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
      const action = p.health === "Low stock"
        ? `<button class="btn primary sm" style="width:100%" data-act="row-send" data-i="${i}">Send to FBA</button>`
        : `<button class="btn dark sm split" style="width:100%;justify-content:space-between">No action required ${DCARET}</button>`;
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
        <div style="align-self:start">${action}</div>
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
      <div class="searchbox"><input placeholder="Search by SKU, ASIN, or any product detail" readonly><button>Search</button></div>
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
          <div class="ditem disabled">Print Item Labels</div>
          <div class="ditem disabled">Create sale</div>
          <div class="ditem" data-act="send-fba" data-tour="send-fba">Send to FBA</div>
        </div>` : ""}
      </div>
    </div>`;
  }

  // extra inventory actions
  A.actions["group-toggle"] = () => { A.state.groupOpen = !A.state.groupOpen; A.render(); };
  A.actions["row-send"] = (ctx) => { A.state.selected.add(+ctx.el.dataset.i); A.navigate("sendfc"); };
  A.actions["create-removal"] = () => { if (A.state.selected.size) A.navigate("removal"); };

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
    // [name, refId, created, createdTime, updated, updatedTime, shipTo, deliveryWin, skus, units, located, status, work]
    const sh = [
      ["FBA STA (04/09/2026 03:02)-TPA2", "SAMPLE-TPA2-001, REF-TPA2-001", "Apr 9, 2026", "11:01 AM", "Jun 6, 2026", "1:25 PM", "TPA2", "Jun 7 – Jun 13, 2026", 4, 40, "40, 40", "Closed", false],
      ["FBA ASDN (06/06/2026 05:03)-TEB6", "SAMPLE-TEB6-002, REF-TEB6-002", "Jun 6, 2026", "1:03 PM", "Jun 6, 2026", "1:10 PM", "TEB6", "Jun 7 – Jun 13, 2026", 1, 1, "0, 0", "Shipped", false],
      ["FBA ASDN (06/06/2026 05:03)-TEB6", "SAMPLE-TEB6-003, REF-TEB6-003", "Jun 6, 2026", "1:03 PM", "Jun 6, 2026", "1:10 PM", "TEB6", "Jun 7 – Jun 13, 2026", 1, 2, "0, 0", "Shipped", false],
      ["FBA STA (05/22/2026 12:33)-FAT2", "SAMPLE-FAT2-004, REF-FAT2-004", "May 22, 2026", "8:33 PM", "Jun 6, 2026", "10:49 AM", "FAT2", "Jun 21 – Jun 27, 2026", 5, 31, "0, 0", "In transit", false],
      ["FBA STA (04/23/2026 03:41)-SNA4", "SAMPLE-SNA4-005, REF-SNA4-005", "Apr 23, 2026", "11:41 AM", "Jun 6, 2026", "7:03 AM", "SNA4", "May 24 – May 30, 2026", 5, 21, "21, 20", "Closed", false],
      ["FBA STA (04/09/2026 03:02)-TEB4", "SAMPLE-TEB4-006, REF-TEB4-006", "Apr 9, 2026", "11:01 AM", "Jun 6, 2026", "3:18 AM", "TEB4", "May 31 – Jun 6, 2026", 4, 40, "40, 7", "Receiving", false],
      ["FBA STA (06/05/2026 03:56)-SAT1", "SAMPLE-SAT1-007, REF-SAT1-007", "Jun 5, 2026", "11:56 AM", "Jun 5, 2026", "12:02 PM", "SAT1", "Jul 12 – Jul 18, 2026", 3, 21, "0, 0", "Working", true],
      ["FBA STA (06/05/2026 03:56)-MCO2", "SAMPLE-MCO2-008, REF-MCO2-008", "Jun 5, 2026", "11:56 AM", "Jun 5, 2026", "12:02 PM", "MCO2", "Jul 12 – Jul 18, 2026", 5, 27, "0, 0", "Working", true],
      ["FBA STA (06/05/2026 03:56)-MDT4", "SAMPLE-MDT4-009, REF-MDT4-009", "Jun 5, 2026", "11:56 AM", "Jun 5, 2026", "12:02 PM", "MDT4", "Jul 12 – Jul 18, 2026", 5, 28, "0, 0", "Working", true],
      ["FBA ASDN (06/04/2026 22:17)-BOS7", "SAMPLE-BOS7-010, REF-BOS7-010", "Jun 5, 2026", "6:17 AM", "Jun 5, 2026", "6:23 AM", "BOS7", "Jun 7 – Jun 13, 2026", 1, 2, "0, 0", "Shipped", false],
    ];
    const cols = "1.95fr 96px 100px 1.15fr 56px 1.05fr 92px 150px";
    const rows = sh.map(s => {
      const [name, ref, created, createdT, updated, updatedT, shipTo, win, skus, units, located, status, work] = s;
      const nextBtn = work
        ? `<div class="split-btn"><button class="btn primary sm main" data-act="goto" data-page="sendfc">Work on shipment</button><button class="btn primary sm more">${DCARET}</button></div>`
        : `<div class="split-btn"><button class="btn dark sm main">Track shipment</button><button class="btn dark sm more">${DCARET}</button></div>`;
      return `
      <div class="invrow" style="grid-template-columns:${cols}">
        <div><a>${esc(name)}</a><div class="sub-time">${ref}</div></div>
        <div>${created}<div class="sub-time">${createdT}</div></div>
        <div>${updated}<div class="sub-time">${updatedT}</div></div>
        <div><b>${shipTo}</b><div class="sub-time">Delivery window ${win}</div></div>
        <div><a>${skus}</a></div>
        <div><b>${units}</b><a class="units-link">${located}</a></div>
        <div class="b">${status}</div>
        <div>${nextBtn}</div>
      </div>`;
    }).join("");
    return `
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
      <div class="searchbox sm"><input placeholder="Search by shipment ID" readonly><button>&#9906;</button></div>
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
    </div>
    <div class="tbl-foot"><span>Page 1</span><a>Next &#8250;</a></div>`;
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
