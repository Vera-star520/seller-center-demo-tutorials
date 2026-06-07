/* ============================================================
   Send to FC — interactive 4-step shipment wizard.
   Steps: 1 Choose inventory · 2 Confirm shipping · 3 Print box labels
          · 4 Confirm carrier/freight · Final Tracking details

   TUTORIAL ANCHORS (public contract — do not rename without grepping
   console/tutorials/ first; verified by console/_smoke.js):
     data-tour="qty-{i}"          Step 1 boxes input (per SKU index)
     data-tour="packing-{i}"      Step 1 packing-details dropdown (per SKU)
     data-tour="ship-from"        Step 1 "Ship from another address" link
     data-tour="confirm-step1"    Step 1 "Confirm and continue"
     data-tour="mode-{id}"        Step 2 shipping-mode card (agl|send|own)
     data-tour="placement-{id}"   Step 2 placement option row
     data-tour="confirm-step2"    Step 2 "Confirm shipping destinations"
     data-tour="print-labels"     Step 3 first shipment "Print" button
     data-tour="continue-step3"   Step 3 "Continue to carrier…"
     data-tour="confirm-step4"    Step 4 "Confirm shipment information"
     data-tour="save-tracking"    Final step "Save"
     data-tour="pack-upb"         Packing modal "Units per box" field
     data-tour="box-weight"       Box-contents modal first box weight field
   ============================================================ */
(function () {
  const A = window.App, D = window.DATA, esc = A.esc;
  const DCARET = `<svg class="caret" viewBox="0 0 11 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l4.5 4.5L10 1"/></svg>`;
  const PENCIL = `<svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13.6 3.4a1.55 1.55 0 0 1 2.2 2.2L6.6 14.8l-3 .8.8-3 9.2-9.2z"/></svg>`;
  const IGLYPH = `<span class="info-i">i</span>`;
  const EYE = `<svg viewBox="0 0 22 22" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 11S4.8 4.5 11 4.5 20.5 11 20.5 11 17.2 17.5 11 17.5 1.5 11 1.5 11Z"/><circle cx="11" cy="11" r="2.6"/></svg>`;
  const TRASH = `<svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5.5h14M7.5 5.5V3.6h5v1.9M5.4 5.5l.7 11.4h7.8l.7-11.4M8.4 8.6v6.2M11.6 8.6v6.2"/></svg>`;
  const SEARCHIC = `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.8 12.8L17 17"/></svg>`;
  function shipName(s) { return "FBA STA (06/05/2026 03:56)-" + s.fc; }

  A.initWizard = function () {
    let skus = [...A.state.selected];
    if (!skus.length) skus = [0, 1];
    skus = skus.slice(0, 5).sort((a, b) => a - b);
    A.state.wizard = {
      skus,
      openStep: 1,
      done: {},
      addrId: D.ADDRESSES[0].id,
      destination: "United States",
      shipMode: "own",
      placement: null,
      qty: {},                 // index -> boxes
      ready: {},               // index -> confirmed ("ready to send")
      activeTab: "all",        // "all" | "ready"
    };
  };

  /* Apply a declarative wizard scenario onto the live wizard state. This is the
     Demo-owned half of App.setScenario: tutorials describe *what* state a step
     needs and this function knows *how* to write it, so tutorials never touch
     wizard internals directly. Only keys present in `s` are applied.
       openStep     number  — which step panel is expanded
       done         array   — step numbers marked complete (replaces the set)
       ready        array | "all" — SKU indices confirmed "ready to send"
       qtyDefault   number  — fill boxes for any SKU that has none yet
       qty          object  — explicit {index: boxes} overrides
       placement / shipMode / activeTab / addrId / destination — direct fields */
  A.applyWizardScenario = function (w, s) {
    if ("qtyDefault" in s) w.skus.forEach(i => { if (!(+w.qty[i] > 0)) w.qty[i] = s.qtyDefault; });
    if ("qty" in s) Object.assign(w.qty, s.qty);
    if ("ready" in s) { w.ready = {}; (s.ready === "all" ? w.skus : s.ready).forEach(i => { w.ready[i] = true; }); }
    if ("activeTab" in s) w.activeTab = s.activeTab;
    if ("done" in s) { w.done = {}; (s.done || []).forEach(n => { w.done[n] = true; }); }
    if ("placement" in s) w.placement = s.placement;
    if ("shipMode" in s) w.shipMode = s.shipMode;
    if ("addrId" in s) w.addrId = s.addrId;
    if ("destination" in s) w.destination = s.destination;
    if ("openStep" in s) w.openStep = s.openStep;
  };

  /* Resolve a scenario `modal` spec to a modal node (or null to close).
       {type:"packing", i?}  — packing details for a SKU (defaults to first SKU)
       {type:"boxes",   n?}  — box contents for a shipment (defaults to first) */
  A.scenarioModal = function (m) {
    if (!m) return null;
    if (m.type === "packing") return packingModal(m.i != null ? m.i : W().skus[0]);
    if (m.type === "boxes") return boxesModal(m.n != null ? m.n : D.SHIPMENTS[0].n);
    return null;
  };

  function W() { return A.state.wizard; }
  function addr() { return D.ADDRESSES.find(a => a.id === W().addrId); }
  function unitsOf(i) { return (+W().qty[i] || 0) * (D.PRODUCTS[i].unitsPerBox || 1); }
  function readyList() { const r = W().ready || {}; return D.PRODUCTS.map((_, i) => i).filter(i => r[i]); }
  function totals() {
    const list = readyList();
    const boxes = list.reduce((s, i) => s + (+W().qty[i] || 0), 0);
    const units = list.reduce((s, i) => s + unitsOf(i), 0);
    return { skus: list.length, units, boxes };
  }

  /* ----------------------------- PAGE ----------------------------- */
  A.pages.sendfc = function () {
    const w = W();
    return `
    <div class="wf-head">
      <div>
        <h1 class="page-title" style="font-size:28px">Send to Amazon</h1>
      </div>
    </div>
    ${step1()}
    ${step2()}
    ${step3()}
    ${step4()}
    ${stepFinal()}`;
  };

  function stepShell(n, title, isOpen, isDone, summary, body) {
    return `
    <div class="step ${isOpen ? "" : "collapsed"}">
      <div class="step-bar">
        ${isDone ? `<span class="check">&#10003;</span>` : ""}
        <span class="stepn">${n === "F" ? "Final step" : "Step " + n}: ${title}</span>
        ${isDone && summary ? `<span class="summ">${summary}</span>` : ""}
        <span class="sp">
          ${isDone ? `<a data-act="wf-open" data-step="${n}">View / edit</a>` : ""}
        </span>
      </div>
      ${isOpen ? `<div class="step-body">${body}</div>` : ""}
    </div>`;
  }

  /* --------------------------- STEP 1 --------------------------- */
  function step1() {
    const w = W();
    const open = w.openStep === 1, done = !!w.done[1];
    const t = totals();
    const II = `<span class="info-i">i</span>`;
    const ready = w.activeTab === "ready";

    // "SKUs ready to send" tab — read-only confirmed view (one row per confirmed SKU)
    function readyRow(p, i, boxes, unitsOut) {
      return `
      <div class="invrow confirmed" style="grid-template-columns:1.9fr 240px 1.15fr 250px;align-items:start">
        <div class="prod"><div class="thumb"></div><div class="pcol">
          <a class="pname">${esc(p.name)}</a>
          <div class="pmeta kvline"><div>SKU: ${p.sku}</div><div>ASIN: ${p.asin}</div><div>FBA Storage Type: <b>${p.storage}</b></div></div>
          ${p.awd ? `<span class="tag-awd" style="margin-top:6px">AWD eligible</span>` : ""}
        </div></div>
        <div>
          <div class="pack-cell">
            <button class="dropbtn" style="flex:1" tabindex="-1">${p.asin} ${DCARET}</button>
            <button class="pen-edit eye-view" data-act="wf-packing" data-i="${i}" title="Preview packing details" aria-label="Preview packing details">${EYE}</button>
          </div>
        </div>
        <div class="small muted kvline">
          <div>Units per box: <b>${p.unitsPerBox}</b></div>
          <div>Prep not required</div>
          <div>Manufacturer barcode</div>
          <a class="small" style="color:var(--link);display:inline-flex;align-items:center;gap:5px;margin-top:8px">More inputs ${DCARET}</a>
        </div>
        <div class="col qtycell" style="gap:6px">
          <div class="ready-line"><span class="rcheck">&#10003;</span> <b>Ready to send</b> <a class="editlink" data-act="wf-uncheck" data-i="${i}">(Modify or remove)</a></div>
          <div class="small muted" style="margin-top:2px">Boxes: ${boxes}</div>
          <div class="small muted">Units: ${unitsOut}</div>
        </div>
      </div>`;
    }

    // "All FBA SKUs" tab — selection view with checkbox + quantity inputs
    function allRow(p, i, boxes, unitsOut, confirmed) {
      return `
      <div class="invrow${confirmed ? " confirmed" : ""}" style="grid-template-columns:26px 1.7fr 210px 1.2fr 210px;align-items:start">
        <div class="ck" data-act="wf-rowcheck" style="margin-top:2px"></div>
        <div class="prod"><div class="thumb"></div><div class="pcol">
          <div class="pname pname-1">${esc(p.shortName)}</div>
          <div class="pmeta kvline"><div>SKU: ${p.sku}</div><div>ASIN: ${p.asin}</div><div>FBA Storage Type: <b>${p.storage}</b></div></div>
          ${p.awd ? `<span class="tag-awd" style="margin-top:6px">AWD eligible</span>` : ""}
        </div></div>
        <div>
          <div class="pack-cell">
            <button class="dropbtn" data-act="wf-packing" data-i="${i}"${i < 2 ? ` data-tour="packing-${i}"` : ""} style="flex:1">${p.asin} ${DCARET}</button>
            <button class="pen-edit" data-act="wf-packing" data-i="${i}" title="Edit packing details" aria-label="Edit packing details">${PENCIL}</button>
          </div>
        </div>
        <div class="small muted kvline">
          <div>Units per box: <b>${p.unitsPerBox}</b></div>
          <div>Prep not required</div>
          ${p.awd ? `<div>Manufacturer barcode</div>` : `<div class="fee-note"><div class="muted">Eligible for fulfillment fee savings</div><a>Enroll in Ships in Product Packaging</a></div><div style="margin-top:4px">Manufacturer barcode</div>`}
          <a class="small mute-link" style="display:inline-flex;align-items:center;gap:5px;margin-top:6px">More inputs ${DCARET}</a>
        </div>
        <div class="col qtycell" style="gap:7px">
          <div class="row" style="gap:12px;align-items:flex-start">
            <div class="fld" style="width:70px"><label style="font-size:12.5px">Boxes</label><input class="inp qty boxin" style="width:70px" data-input="qty" data-i="${i}" data-tour="qty-${i}" value="${boxes || ""}"${confirmed ? " readonly" : ""}></div>
            <div class="fld" style="width:70px"><label style="font-size:12.5px">Units</label><input class="inp qty unitsout" style="width:70px;background:#eceef1;color:var(--muted)" value="${unitsOut}" readonly></div>
          </div>
          ${p.recQty && !confirmed ? `<div class="tiny" style="color:var(--link)">Recommended qty: ${p.recQty}</div>` : ""}
          <div class="confirmwrap" data-i="${i}" style="${confirmed || boxes > 0 ? "" : "display:none"}">
            ${confirmed
              ? `<span class="ready-badge">&#10003; Added to ready to send</span> <a class="small editlink" data-act="wf-uncheck" data-i="${i}">Edit</a>`
              : `<button class="btn confirm-send sm" data-act="wf-confirm-sku" data-i="${i}">Confirm to send</button>`}
          </div>
        </div>
      </div>`;
    }

    const rows = D.PRODUCTS.map((p, i) => {
      const boxes = +w.qty[i] || 0;
      const confirmed = !!(w.ready && w.ready[i]);
      const unitsOut = boxes ? boxes * (p.unitsPerBox || 1) : "";
      if (ready && !confirmed) return "";
      return ready ? readyRow(p, i, boxes, unitsOut) : allRow(p, i, boxes, unitsOut, confirmed);
    }).join("");

    const tabs = `
      <div class="s1tabwrap">
        <div class="s1tabs">
          <div class="s1tab ${ready ? "" : "on"}" data-act="wf-tab" data-tab="all">All FBA SKUs</div>
          <div class="s1tab ${ready ? "on" : ""}" data-act="wf-tab" data-tab="ready">SKUs ready to send (${t.skus})</div>
        </div>
        <span class="small muted s1rpp">25 results per page</span>
      </div>`;

    // ----- "SKUs ready to send" tab body: read-only confirmed list -----
    if (ready) {
      const body = `
        ${tabs}
        <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;margin:4px 0 24px;align-items:start;max-width:920px">
          <div>
            <div class="b small" style="margin-bottom:9px">Ship from ${II}</div>
            <div class="small muted" style="line-height:1.6;max-width:380px">${esc(addr().oneLine)}</div>
            <a class="small" data-act="wf-shipfrom" data-tour="ship-from" style="display:inline-block;margin-top:6px">Ship from another address</a>
          </div>
          <div>
            <div class="b small" style="margin-bottom:9px">Marketplace destination ${II}</div>
            <select class="sel" data-change="dest" style="max-width:300px"><option>United States</option><option>Canada</option><option>Mexico</option></select>
          </div>
        </div>
        <div class="invtable">
          <div class="invhead" style="grid-template-columns:1.9fr 240px 1.15fr 250px">
            <span>SKU details<span class="info" style="color:var(--link)">Display preferences</span></span><span>Packing details ${II}</span><span>Information/action</span><span>Quantity to send</span>
          </div>
          ${rows || `<div style="padding:34px;text-align:center;color:var(--muted);font-size:13px">No SKUs are ready to send yet. Go to <b>All FBA SKUs</b>, enter <b>Boxes</b> for a SKU, then click <b>Confirm to send</b>.</div>`}
        </div>
        <div class="tbl-foot"><span class="pgnav"><a class="lk">&laquo; First</a><a class="lk">&lsaquo; Previous</a><span class="pgcur">Page 1</span><a class="lk">Next &rsaquo;</a></span></div>
        <div class="between mt16">
          <span class="small muted">SKUs ready to send: <b>${t.skus}</b> (${t.units} units)</span>
          <button class="btn primary ${t.skus ? "" : "disabled"}" data-act="wf-confirm1" data-tour="confirm-step1">Confirm and continue</button>
        </div>`;
      return stepShell(1, "Choose inventory to send", open, done, `Boxes: ${t.boxes} · SKUs: ${t.skus} · Units: ${t.units}`, body);
    }

    // ----- "All FBA SKUs" tab body: selection view (original) -----
    const body = `
      ${tabs}
      <div style="display:grid;grid-template-columns:0.85fr 1.5fr 1.5fr;gap:28px;margin-bottom:18px;align-items:start">
        <div>
          <div class="b small" style="margin-bottom:9px">SKU selection method ${II}</div>
          <label class="row" style="gap:8px;margin-bottom:7px;cursor:pointer"><span class="radio on"></span><span class="small">Select from list</span></label>
          <label class="row" style="gap:8px;cursor:pointer"><span class="radio"></span><span class="small">File upload</span></label>
        </div>
        <div>
          <div class="b small" style="margin-bottom:9px">Ship from ${II}</div>
          <div class="small muted" style="line-height:1.55">${esc(addr().oneLine)}</div>
          <a class="small" data-act="wf-shipfrom" data-tour="ship-from">Ship from another address</a>
        </div>
        <div class="row" style="gap:28px;align-items:start">
          <div class="fld" style="max-width:200px;flex:1"><label>Marketplace destination ${II}</label><select class="sel" data-change="dest"><option>United States</option><option>Canada</option><option>Mexico</option></select></div>
          <div>
            <div class="b small" style="margin-bottom:9px">Filter</div>
            <label class="row" style="gap:8px;margin-bottom:7px;cursor:pointer"><span class="checkbox"></span><span class="tiny">Only show SKUs with case pack template</span></label>
            <label class="row" style="gap:8px;cursor:pointer"><span class="checkbox"></span><span class="tiny">Hide SKUs with errors</span></label>
          </div>
        </div>
      </div>
      <div class="row" style="justify-content:flex-end;margin-bottom:16px;gap:0;align-items:stretch">
        <select class="sel sm" style="height:38px;width:150px;border-radius:7px 0 0 7px"><option>Search by title</option><option>Search by SKU</option><option>Search by ASIN</option></select>
        <input class="inp sm" style="height:38px;width:240px;border-radius:0;border-left:0" placeholder="Search">
        <button class="btn sm search-btn" style="height:38px;border-radius:0 7px 7px 0;padding:0 18px" aria-label="Search"><svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.8 12.8L17 17"/></svg></button>
      </div>
      <div class="invtable">
        <div class="invhead" style="grid-template-columns:26px 1.7fr 210px 1.2fr 210px">
          <div class="ck" data-act="wf-checkall"></div><span>SKU details<span class="info" style="color:var(--link)">Display preferences</span></span><span>Packing details ${II}</span><span>Information / action</span><span>Quantity to send</span>
        </div>
        ${rows}
      </div>
      <div class="tbl-foot"><span class="pager"><span class="pg">&#8249;</span><span>1</span><span class="pg">&#8250;</span></span></div>
      <div class="between mt16">
        <span class="small muted">SKUs ready to send: <b>${t.skus}</b> (${t.units} units)</span>
        <button class="btn primary ${t.skus ? "" : "disabled"}" data-act="wf-confirm1" data-tour="confirm-step1">Confirm and continue</button>
      </div>`;
    return stepShell(1, "Choose inventory to send", open, done, `Boxes: ${t.boxes} · SKUs: ${t.skus} · Units: ${t.units}`, body);
  }

  /* --------------------------- STEP 2 --------------------------- */
  const SECCARET = `<svg class="sc-caret" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6l5-4 5 4"/></svg>`;
  const BOXIC = `<svg class="sc-ic" viewBox="0 0 36 32" fill="none"><path d="M18 3 4 9.5v13L18 29l14-6.5v-13z" fill="#e8caa0" stroke="#bd9462" stroke-width="1.3" stroke-linejoin="round"/><path d="M4 9.5 18 16l14-6.5M18 16v13" stroke="#bd9462" stroke-width="1.3" stroke-linejoin="round"/></svg>`;
  const PALLETIC = `<svg class="sc-ic" viewBox="0 0 40 32" fill="none"><g fill="#e8caa0" stroke="#bd9462" stroke-width="1.3" stroke-linejoin="round"><rect x="13.5" y="3" width="13" height="10"/><rect x="5" y="13" width="13" height="11"/><rect x="22" y="13" width="13" height="11"/></g><path d="M20 3v10M11.5 13v11M28.5 13v11" stroke="#bd9462" stroke-width="1" stroke-linecap="round" opacity="0.55"/><g stroke="#bd9462" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 24.5h33M3.5 29h33M7 24.5V29M20 24.5V29M33 24.5V29"/></g></svg>`;
  const CALIC = `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="var(--teal)" stroke-width="1.4" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3"/></svg>`;

  function step2() {
    const w = W();
    const open = w.openStep === 2, done = !!w.done[2];
    const II = `<span class="info-i">i</span>`;

    const modes = [
      { id: "agl", title: "Amazon Global Logistics (recommended)",
        body: `<div class="tiny muted" style="line-height:1.55;margin-top:8px">Amazon-managed ocean &amp; air freight from your supplier into the FBA network.</div>
          <div class="tiny muted" style="margin-top:20px">Air: 4 – 20 days; Ocean: 25 – 40 days</div>` },
      { id: "send", title: `Amazon SEND ${II}`,
        body: `<div class="tiny muted" style="line-height:1.55;margin-top:8px">International shipping services by partnered carriers</div>
          <div class="tiny muted" style="margin-top:20px">Air: 4 – 20 days; Ocean: 25 – 40 days</div>` },
      { id: "own", title: "Or use your own carrier",
        body: `<div class="tiny muted" style="line-height:1.55;margin-top:8px">Select FIST carriers or other carriers</div>
          <div class="row" style="gap:9px;margin-top:16px"><span class="tag-new">New</span><span class="small">FIST Benefits ${II}</span></div>` },
    ];
    const modeCards = modes.map(m => {
      // AGL + Amazon SEND rates are still loading — show a skeleton placeholder.
      if (m.id === "agl" || m.id === "send") {
        return `<div class="smode-card sk-mode" data-mode="${m.id}" data-tour="mode-${m.id}" aria-busy="true">
          <div class="sk sk-title" style="width:72%"></div>
          <div class="sk sk-line" style="width:94%;margin-top:20px"></div>
          <div class="sk sk-line" style="width:86%;margin-top:9px"></div>
          <div class="sk sk-line" style="width:64%;margin-top:9px"></div>
          <div class="sk sk-line" style="width:42%;height:14px;margin-top:26px"></div>
        </div>`;
      }
      const sel = w.shipMode === m.id;
      return `<div class="smode-card${sel ? " msel" : ""}" data-act="wf-mode" data-mode="${m.id}" data-tour="mode-${m.id}">
        ${sel ? `<span class="smode-check">&#10003;</span>` : ""}
        <div class="smode-title${sel ? " on" : ""}">${m.title}</div>
        ${m.body}
      </div>`;
    }).join("");

    const placements = D.PLACEMENTS.map(o => {
      const sel = w.placement === o.id;
      return `<div class="plc-row${sel ? " psel" : ""}" data-act="wf-place" data-id="${o.id}" data-tour="placement-${o.id}">
        <div class="radio ${sel ? "on" : ""}"></div>
        <div class="plc-name"><div class="b small">${o.name}</div><div class="tiny muted" style="line-height:1.5;margin-top:6px">${o.desc}</div></div>
        <div class="plc-win"><div class="b small">${o.window}${o.window.includes("Starting") ? " " + II : ""}</div><div class="tiny muted" style="margin-top:4px">Available</div></div>
        <div class="plc-cost">
          ${o.lowest ? `<span class="pill green plc-lowest">Lowest cost</span>` : ""}
          <div class="plc-line"><span class="small muted">Total</span><span class="b small">${o.total}</span></div>
          <div class="plc-line"><span class="small muted">Placement Fee:</span><span class="small muted">${o.placement}</span></div>
          <div class="plc-line"><span class="small muted">Estimated Shipping Cost*:</span><span class="small muted">${o.shipping}</span></div>
        </div>
      </div>`;
    }).join("");

    const shipCards = D.SHIPMENTS.map(s => {
      const thumbs = Array.from({ length: Math.min(s.boxes, 5) }, () => `<span class="sc-thumb"></span>`).join("");
      return `<div class="shipcard">
        <div class="shipcard-head">Shipment #${s.n}</div>
        <div class="sc-top">
          <div class="small">Ship to: <b>${s.fc}</b> — ${esc(s.addr)}</div>
          <div class="small" style="margin-top:5px">Fulfillment capability: Standard ${II}</div>
        </div>
        <div class="sc-sec">
          <div class="sc-sechead">Shipment contents ${SECCARET}</div>
          <div class="sc-secbody">
            <div class="between" style="align-items:flex-start;gap:16px">
              <div class="small kvline"><div>Boxes: <b>${s.boxes}</b></div><div>SKUs: <b>${s.skus}</b></div><div>Units: <b>${s.units}</b></div></div>
              <div style="text-align:right">
                <div class="sc-thumbs">${thumbs}</div>
                <a class="small" style="display:inline-block;margin-top:8px">View contents</a>
              </div>
            </div>
            <div class="small muted" style="margin-top:14px">SKUs that need prepping by seller: <b>${s.skus}</b> (${s.units} units)</div>
          </div>
        </div>
        <div class="sc-sec">
          <div class="sc-sechead">Shipping mode ${SECCARET}</div>
          <div class="sc-secbody">
            <div class="sc-mode"><span class="radio"></span>${BOXIC}<span class="small">Small parcel delivery (SPD)</span></div>
            <div class="sc-mode" style="margin-top:14px"><span class="radio on"></span>${PALLETIC}<div><div class="small">Less than and full truckload (LTL/FTL)</div><div class="tiny muted">Partnered carriers unavailable*</div></div></div>
          </div>
        </div>
        <div class="sc-sec">
          <div class="sc-sechead">Pallet estimates ${SECCARET}</div>
          <div class="sc-secbody">
            <div class="sc-pall">
              <div class="small kvline"><div>Pallets: <b>0</b> ${II}</div><div>Value: --</div><div>Freight class: --</div></div>
              <div class="small kvline"><div>Total weight: --</div><div>Total volume: --</div></div>
            </div>
          </div>
        </div>
        <div class="sc-sec">
          <div class="sc-sechead">Carrier ${SECCARET}</div>
          <div class="sc-secbody"><div class="small muted" style="font-style:italic">You'll select your LTL carrier in Step 4.</div></div>
        </div>
      </div>`;
    }).join("");

    const body = `
      <div class="b small" style="margin-bottom:12px">Shipping mode</div>
      <div class="smode-grid">${modeCards}</div>
      <div class="b" style="font-size:17px;margin:30px 0 8px">Choose placement option</div>
      <div class="row" style="gap:18px;margin:16px 0;flex-wrap:wrap">
        <select class="sel" style="width:250px"><option>Small parcel delivery (SPD)</option><option>Pallet delivery</option></select>
        <span class="b small">Delivery window ${II}</span>
        <span class="date-pill">${CALIC} Jul 12 – Jul 18, 2026</span>
      </div>
      <div class="plc-table">
        <div class="plc-head"><span></span><span>Placement options</span><span>Delivery window</span><span>Total cost (shipping estimated) ${II}</span></div>
        ${placements}
      </div>
      <div class="row" style="gap:10px;margin:22px 0 14px"><span class="b small">Number of shipments: ${D.SHIPMENTS.length}</span></div>
      <div class="grid2 shipgrid">${shipCards}</div>
      <div class="sc-foot">
        <div class="sc-foot-left">
          <div class="b small" style="margin-bottom:6px">Ready to continue?</div>
          <div class="small muted" style="line-height:1.55;max-width:470px">Before we generate the shipping labels for you, take a moment to review the details and check that all is correct.</div>
        </div>
        <div class="sc-foot-right">
          <div class="plc-line"><span class="small muted">Total placement fees:</span><span class="small">$0.00</span></div>
          <div class="plc-line"><span class="small muted">Total estimated shipping fees:</span><span class="small">$0.00</span></div>
          <div class="plc-line" style="margin-top:8px"><span class="b small">Total estimated placement and shipping fees (other fees may apply):</span><span class="b small">$0.00</span></div>
          <button class="btn primary ${w.placement ? "" : "disabled"}" data-act="wf-confirm2" data-tour="confirm-step2" style="margin-top:16px;width:100%">Confirm shipping destinations</button>
        </div>
      </div>`;
    return stepShell(2, "Confirm shipping", open, done, `Destinations: ${D.SHIPMENTS.length} · Method: LTL/FTL`, body);
  }

  /* --------------------------- STEP 3 --------------------------- */
  function step3() {
    const w = W();
    const open = w.openStep === 3, done = !!w.done[3];
    const II = `<span class="info-i">i</span>`;
    const cards = D.SHIPMENTS.map((s, idx) => `
      <div class="s3card">
        <div class="s3card-head">
          <span class="b small">Shipment #${s.n}</span>
          <a class="s3edit" data-act="wf-boxes" data-n="${s.n}">${PENCIL}<span>View or edit contents</span></a>
        </div>
        <div class="s3card-body">
          <div class="s3kv"><span class="k">Shipment name:</span> <b>${esc(shipName(s))}</b> <a class="s3rename">Rename</a></div>
          <div class="s3kv"><span class="k">Shipment ID:</span> <b>${s.id}</b></div>
          <div class="s3kv"><span class="k">Amazon Reference ID:</span> <b>${s.ref && s.ref !== "—" ? s.ref : "--"}</b></div>
          <div class="s3kv"><span class="k">Ship from:</span> <b>${esc(addr().oneLine)}</b></div>
          <div class="s3kv"><span class="k">Ship to:</span> <b>${s.fc} — ${esc(s.addr)}</b></div>
          <div class="s3kv"><span class="k">Fulfillment capability:</span> <b>Standard</b> ${II}</div>
          <div class="s3contents">
            <span class="small">Shipment contents: Boxes: ${s.boxes}, SKUs: ${s.skus}, Units: ${s.units}</span>
            ${DCARET}
          </div>
          <div class="b small s3print-h">Print box labels</div>
          <div class="s3print">
            <select class="sel sm" style="height:36px;flex:1"><option>Thermal printing — 4 × 6 inches</option><option>Letter — paper</option></select>
            <button class="btn primary sm" data-act="wf-print" data-n="${s.n}"${idx === 0 ? ' data-tour="print-labels"' : ''}>Print</button>
          </div>
        </div>
      </div>`).join("");
    const body = `
      <div class="s3banner">
        <span class="info-i" style="border-color:var(--link);color:var(--link)">i</span>
        <div>
          <div class="b small">You can now print your box labels and start packing your pallets.</div>
          <div class="small muted" style="margin-top:3px">Pallet labels will be confirmed and provided in the next step.</div>
        </div>
      </div>
      <div class="small" style="margin-bottom:6px">Ship from: <b>${esc(addr().oneLine)}</b></div>
      <div class="b small" style="margin:14px 0 12px">${D.SHIPMENTS.length} confirmed shipments</div>
      <div class="s3grid">${cards}</div>
      <div class="between mt20">
        <span></span>
        <button class="btn primary" data-act="wf-confirm3" data-tour="continue-step3">Continue to carrier and pallet information</button>
      </div>`;
    return stepShell(3, "Print box labels", open, done, `${D.SHIPMENTS.length} shipments · labels printed`, body);
  }

  /* --------------------------- STEP 4 --------------------------- */
  const CARETUP = `<svg class="caret up" viewBox="0 0 11 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l4.5 4.5L10 1"/></svg>`;
  function step4() {
    const w = W();
    const open = w.openStep === 4, done = !!w.done[4];
    const II = `<span class="info-i">i</span>`;
    const cards = D.SHIPMENTS.map((s, idx) => `
      <div class="s4card">
        <div class="s4card-head">
          <span class="b small">Shipment #${s.n}</span>
          <a class="s4edit" data-act="wf-boxes" data-n="${s.n}">${PENCIL}<span>View or edit contents</span></a>
        </div>
        <div class="s4card-body">
          <div class="s4kv"><span class="k">Shipment name:</span> <b>${esc(shipName(s))}</b> <a class="s3rename">Rename</a></div>
          <div class="s4kv"><span class="k">Shipment ID:</span> <b>${s.id}</b></div>
          <div class="s4kv"><span class="k">Amazon Reference ID:</span> <b>${s.ref && s.ref !== "—" ? s.ref : "--"}</b></div>
          <div class="s4kv"><span class="k">Ship from:</span> <b>${esc(addr().oneLine)}</b></div>
          <div class="s4kv"><span class="k">Ship to:</span> <b>${s.fc} — ${esc(s.addr)}</b></div>
          <div class="s4kv"><span class="k">Fulfillment capability:</span> <b>Standard</b> ${II}</div>
        </div>
        <div class="s4sec">
          <div class="s4sechead">
            <span class="small">Shipment contents: Boxes: ${s.boxes}, SKUs: ${s.skus}, Units: ${s.units}</span>
            ${DCARET}
          </div>
        </div>
        <div class="s4sec">
          <div class="s4secbody">
            <div class="b small" style="margin-bottom:6px">Carrier</div>
            <div class="small muted" style="margin-bottom:14px">Tracking information must be provided</div>
            <label class="row s4ck"><span class="checkbox"></span><span class="small">I want to ship with FIST carrier only ${II}</span></label>
            <div class="grid2 s4carrier">
              <div class="fld"><label class="small">Non-Amazon partnered carrier</label><select class="sel sm"><option>FIST Carriers</option><option>Other</option></select></div>
              <div class="fld"><label class="small">How will they be transported?</label><select class="sel sm"><option>Ocean</option><option>Air</option><option>Ground</option></select></div>
            </div>
          </div>
        </div>
        <div class="s4sec">
          <div class="s4sechead"><span class="b small">Delivery window</span>${CARETUP}</div>
          <div class="s4secbody">
            <div class="small muted s4dw-desc">Delivery Window is a calendar week when you expect your shipments to arrive at Amazon. Shipments arriving within their scheduled windows will receive priority processing, while shipments arriving outside of their scheduled delivery windows may face appointment and receive delays. <a>Learn more</a></div>
            <span class="date-pill s4date">${CALIC} Jul 12 – Jul 18, 2026</span>
            <div class="small muted s4dw-edit">${II} This delivery window can be edited in the final step up to Jul 12, 2026 UTC.</div>
            <label class="row s4ck" style="align-items:flex-start">
              <span class="checkbox on">&#10003;</span>
              <span class="s4dw-allow">
                <span class="small">Allow FIST carriers to update my delivery window</span>
                <span class="tiny muted s4dw-sub">FIST carriers will automatically update your Delivery Window. Please ensure you select a reasonable Delivery Window slot initially so that FIST carriers can begin updating it once you start using their services. Note that you remain responsible for your Delivery Window performance. For more information and to view eligible carriers, <a>click here</a>.</span>
              </span>
            </label>
            ${idx === 0 ? `<div class="s4dw-warn">
              <span class="info-i" style="border-color:#2c7bbf;color:#2c7bbf">i</span>
              <div class="small">Avoid delays by providing accurate delivery window. 1 of your recent shipments arrived outside the delivery window (<a>show history</a>).</div>
              <span class="s4dw-close">&times;</span>
            </div>` : ""}
          </div>
        </div>
        <div class="s4sec">
          <div class="s4sechead"><span class="small">Pallet information:</span>${CARETUP}</div>
          <div class="s4secbody">
            <div class="row s4pallet"><span class="small">How many pallets will you be shipping?</span><input class="inp sm" aria-label="Number of pallets"></div>
          </div>
        </div>
        <div class="s4sec">
          <div class="s4sechead"><span class="small">Print pallet labels</span>${CARETUP}</div>
          <div class="s4secbody"><div class="small muted">Awaiting pallet information</div></div>
        </div>
      </div>`).join("");
    const body = `
      <div class="b small" style="margin-bottom:4px">Confirm shipment information</div>
      <div class="small muted" style="margin-bottom:18px">After you print pallet labels, the shipment will change to "Ready to ship" status.</div>
      <div class="s4grid">${cards}</div>
      <div class="between mt20">
        <span></span>
        <button class="btn primary" data-act="wf-confirm4" data-tour="confirm-step4">Confirm shipment information</button>
      </div>`;
    return stepShell(4, "Confirm carrier and freight information", open, done, "Carrier: FIST · 5 shipments", body);
  }

  /* --------------------------- FINAL --------------------------- */
  function stepFinal() {
    const w = W();
    const open = w.openStep === 5, done = !!w.done[5];
    const II = `<span class="info-i">i</span>`;
    const first = D.SHIPMENTS[0];
    const tabs = D.SHIPMENTS.map((s, idx) => `
      <div class="fin-tab${idx === 0 ? " on" : ""}">
        <div class="fin-tab-n">Shipment #${s.n}</div>
        <div class="fin-tab-id">Shipment ID: <b>${s.id}</b></div>
        <div class="fin-tab-c">Carrier: FIST Carriers${idx === 0 ? ` <a>(Change carrier)</a>` : ""}</div>
        <div class="fin-tab-p">PRO/freight bill number not yet entered</div>
      </div>`).join("");
    const body = `
      <div class="fin-tabs">${tabs}</div>
      <div class="fin-dw">
        <div class="fin-dw-main">Delivery window: Jul 12, 2026 - Jul 18, 2026 <a>(Edit window)</a></div>
        <div class="fin-dw-sub">This delivery window can be edited in the final step up to Jul 12, 2026 UTC.</div>
      </div>
      <div class="fin-h">Enter PRO/freight bill number:</div>
      <div class="fin-desc">Provide accurate tracking details from your carrier to help us receive your shipments up to 30% faster and make your products available for sale sooner.</div>
      <div class="fin-cols">
        <div>
          <div class="fin-bol-h">Track by Bill of Lading (BOL) Number:</div>
          <label class="fin-opt"><span class="radio on"></span><span class="small">Shipment ID ${first.id} (recommended)</span></label>
          <label class="fin-opt"><span class="radio"></span><span class="small fin-opt-lbl">Other</span><input class="inp fin-disabled" disabled value="Go to Shipment Summary to provide alternative BOL"></label>
          <div class="fin-pro-row"><label>PRO/freight bill number:</label><input class="inp" placeholder="Auto-filled if you ship with FIST carriers"></div>
          <button class="btn primary" data-act="wf-finish" data-tour="save-tracking">Save</button>
        </div>
        <div>
          <div class="fin-req-h">Bill of Lading requirements</div>
          <div class="fin-req-p">The Bill of Lading must include the Amazon Reference ID (PO) for the shipment, as well as box and pallet counts.</div>
          <div class="fin-req-id">Amazon reference ID: <b>${first.ref}</b></div>
          <div class="fin-req-h">Delivery appointment requirements</div>
          <div class="fin-req-p">Your carrier will be required to schedule a delivery appointment. When scheduling the appointment, they must provide box and pallet counts, the Amazon reference ID, and PRO numbers from the Bill of Lading. <a>View detailed instructions</a></div>
        </div>
      </div>
      <div class="fin-foot">
        <div>
          <div class="fin-foot-h">What's next?</div>
          <div class="fin-foot-p">Your shipment or shipments are complete once you've provided tracking information</div>
        </div>
        <div>
          <div class="fin-foot-h">Cost summary</div>
          <div class="fin-cost"><span>Total placement fees:</span><span>$0.00</span></div>
          <div class="fin-cost"><span>Total estimated shipping fees:</span><span>$0.00</span></div>
          <div class="fin-cost fin-cost-total"><span>Total estimated placement and shipping fees (other fees may apply):</span><span>$0.00</span></div>
        </div>
      </div>`;
    return stepShell("F", "Tracking details", open, done, "", body);
  }

  /* --------------------------- ACTIONS --------------------------- */
  Object.assign(A.actions, {
    "input:qty": (ctx) => { const i = +ctx.el.dataset.i; const v = ctx.value.replace(/[^0-9]/g, ""); W().qty[i] = v ? +v : 0; refreshReady(ctx.el); },
    "wf-confirm-sku": (ctx) => { const i = +ctx.el.dataset.i; if ((+W().qty[i] || 0) > 0) { W().ready = W().ready || {}; W().ready[i] = true; A.render(); } },
    "wf-uncheck": (ctx) => { const i = +ctx.el.dataset.i; if (W().ready) W().ready[i] = false; A.render(); },
    "wf-tab": (ctx) => { W().activeTab = ctx.el.dataset.tab; A.render(); },
    "change:dest": (ctx) => { W().destination = ctx.value; },
    "wf-mode": (ctx) => { W().shipMode = ctx.el.dataset.mode; A.render(); },
    "wf-place": (ctx) => { W().placement = ctx.el.dataset.id; A.render(); },
    "wf-open": (ctx) => { const s = ctx.el.dataset.step; W().openStep = s === "F" ? 5 : +s; A.render(); },
    "wf-confirm1": () => { if (!totals().skus) return; W().done[1] = true; W().openStep = 2; A.render(); },
    "wf-confirm2": () => { if (!W().placement) return; W().done[2] = true; W().openStep = 3; A.render(); },
    "wf-confirm3": () => { W().done[3] = true; W().openStep = 4; A.render(); },
    "wf-confirm4": () => { W().done[4] = true; W().openStep = 5; A.render(); },
    "wf-finish": () => { W().done[5] = true; A.render(); if (window.Guide) Guide.complete(); },
    "wf-shipfrom": () => A.openModal(shipFromModal()),
    "wf-packing": (ctx) => A.openModal(packingModal(+ctx.el.dataset.i)),
    "wf-boxes": (ctx) => A.openModal(boxesModal(+ctx.el.dataset.n)),
    "wf-print": () => {},
    "wf-pick-addr": (ctx) => { W().addrId = ctx.el.dataset.id; A.closeModal(); },
    "wf-add-addr": () => A.openModal(editAddrModal(null)),
    "wf-edit-addr": (ctx) => A.openModal(editAddrModal(ctx.el.dataset.id)),
    "wf-shipfrom-back": () => A.openModal(shipFromModal()),
    "wf-rowcheck": (ctx) => { const on = ctx.el.classList.toggle("on"); ctx.el.innerHTML = on ? "&#10003;" : ""; },
    "wf-checkall": (ctx) => {
      const on = ctx.el.classList.toggle("on"); ctx.el.innerHTML = on ? "&#10003;" : "";
      document.querySelectorAll('.step-body .invrow .ck[data-act="wf-rowcheck"]').forEach(c => { c.classList.toggle("on", on); c.innerHTML = on ? "&#10003;" : ""; });
    },
  });

  // update the "ready to send" count without a full re-render (keeps input focus)
  // keep the Units field + Confirm-to-send button in sync while typing (no re-render → input keeps focus)
  function refreshReady() {
    document.querySelectorAll('[data-input="qty"]').forEach(inp => {
      const i = +inp.dataset.i;
      const boxes = +W().qty[i] || 0;
      const out = inp.closest(".row").querySelector(".unitsout");
      if (out) out.value = boxes ? boxes * (D.PRODUCTS[i].unitsPerBox || 1) : "";
      const wrap = document.querySelector(`.confirmwrap[data-i="${i}"]`);
      if (wrap && !(W().ready && W().ready[i])) wrap.style.display = boxes > 0 ? "" : "none";
    });
  }

  /* --------------------------- MODALS --------------------------- */
  function shipFromModal() {
    const cards = D.ADDRESSES.map(a => {
      const sel = a.id === W().addrId;
      return `
      <div class="addr-card${sel ? " selected" : ""}">
        ${sel ? `<span class="addr-check">&#10003;</span>` : ""}
        <div class="addr-tabs"><div class="addr-tab on">Ship From Address</div><div class="addr-tab">Operating Hours</div></div>
        <div class="addr-body">
          <div class="addr-name">${esc(a.name)}</div>
          <div class="addr-lines">${esc(a.street)}<br>${esc(a.city)}, ${esc(a.state)} ${a.zip}<br>${esc(a.country)}<br>Phone number: ${a.phone}</div>
        </div>
        <div class="addr-foot">
          ${a.isDefault ? `<span class="addr-default">Default address</span>` : ""}
          <button class="btn dark sm" data-act="wf-pick-addr" data-id="${a.id}">${sel ? "Continue" : "Select"}</button>
          <span class="links"><a data-act="wf-edit-addr" data-id="${a.id}">Edit</a><span style="color:var(--line)">|</span><a>Delete</a></span>
        </div>
      </div>`;
    }).join("");
    return A.el(`<div class="modal wide">
      <div class="modal-head"><h3>Choose a ship-from address</h3><span class="x" data-act="close-modal">&#10005;</span></div>
      <div class="modal-body"><div class="addr-grid">
        <div class="addr-add" data-act="wf-add-addr"><span class="plus">+</span><span class="lbl">Add contact</span></div>
        ${cards}
      </div></div>
    </div>`);
  }

  /* Add / edit a ship-from contact (tabbed form, matches the real portal) */
  function editAddrModal(id) {
    const a = id ? D.ADDRESSES.find(x => x.id === id) : null;
    const v = a || { company: "", name: "", street: "", city: "", district: "", state: "Guangdong", country: "China" };
    const word = a ? "Edit" : "Add";
    return A.el(`<div class="modal">
      <div class="modal-head"><h3>${word} ship-from address</h3><span class="x" data-act="close-modal">&#10005;</span></div>
      <div class="modal-body">
        <div class="eaddr-tabs">
          <div class="eaddr-tab on">Ship From Address</div>
          <div class="eaddr-tab">Operating Hours</div>
          <div class="eaddr-tab">Special Instructions (equipment)</div>
        </div>
        <h4 class="eaddr-h">${word} your contact</h4>
        <div class="eaddr-form">
          <div class="fld"><label>Country/Region</label><select class="sel"><option${v.country === "China" ? " selected" : ""}>China</option><option>United States</option><option>Mexico</option><option>Canada</option></select></div>
          <div class="fld"><label>Company name (optional)</label><input class="inp" value="${esc(v.company)}"></div>
          <div class="fld"><label>Full name</label><input class="inp" value="${esc(v.name)}"></div>
          <div class="fld"><label>Street address</label><input class="inp" value="${esc(v.street)}"><input class="inp" placeholder="Apartment, suite, unit, building, floor, etc."></div>
          <div class="fld"><label>City</label><input class="inp" value="${esc(v.city)}"></div>
          <div class="fld"><label>District</label><input class="inp" value="${esc(v.district || "")}"></div>
          <div class="fld"><label>State/Province/Region</label><select class="sel"><option${v.state === "Guangdong" ? " selected" : ""}>Guangdong</option><option>Beijing</option><option>Shanghai</option><option>Zhejiang</option><option>Jiangsu</option></select></div>
        </div>
      </div>
      <div class="modal-foot"><button class="btn ghost" data-act="wf-shipfrom-back">Cancel</button><button class="btn primary" data-act="wf-shipfrom-back">Save</button></div>
    </div>`);
  }

  function packingModal(i) {
    const p = D.PRODUCTS[i];
    return A.el(`<div class="modal">
      <div class="modal-head"><h3>Packing details</h3><span class="x" data-act="close-modal">&#10005;</span></div>
      <div class="modal-body">
        <div class="prod" style="margin-bottom:18px;align-items:flex-start">
          <div class="thumb" style="width:60px;height:60px"></div>
          <div class="pcol">
            <div class="pname" style="font-size:14px;line-height:1.4">${esc(p.shortName)}</div>
            <div class="pmeta kvline" style="font-size:12px;margin-top:6px"><div>SKU: ${p.sku}</div><div>ASIN: ${p.asin}</div><div>FBA Storage Type: <b>${p.storage}</b></div></div>
            ${p.awd ? `<span class="tag-awd" style="margin-top:8px">AWD eligible</span>` : ""}
          </div>
        </div>
        <div class="fld" style="max-width:340px;margin-bottom:16px"><label>Packing template name ${IGLYPH}</label><input class="inp" value="${p.asin}"></div>
        <div class="fld" style="max-width:240px;margin-bottom:18px"><label>Template type ${IGLYPH}</label><select class="sel"><option>Case pack</option><option>Individual units</option></select></div>
        <div class="row" style="gap:24px;align-items:flex-start;margin-bottom:20px;flex-wrap:wrap">
          <div class="fld" style="width:120px"><label>Units per box ${IGLYPH}</label><input class="inp" value="${p.unitsPerBox}" data-tour="pack-upb"></div>
          <div class="fld"><label>Box dimensions (inch)</label><div class="row" style="gap:8px;align-items:center"><input class="inp" style="width:72px" value="${p.boxDims[0]}"><span class="muted">x</span><input class="inp" style="width:72px" value="${p.boxDims[1]}"><span class="muted">x</span><input class="inp" style="width:72px" value="${p.boxDims[2]}"></div></div>
          <div class="fld" style="width:150px"><label>Box weight (lb) ${IGLYPH}</label><input class="inp" value="${p.boxWeight}"></div>
        </div>
        <div style="margin-bottom:18px">
          <div class="b small" style="margin-bottom:5px">Prep category:</div>
          <div style="color:var(--teal-700);font-weight:600;font-size:13px;margin-bottom:7px">No prep needed</div>
          <div class="small" style="line-height:1.5">Manufacturer barcode required ${IGLYPH}<br><span class="muted">(No additional labeling needed)</span></div>
          <div class="tiny muted" style="margin-top:9px;line-height:1.5">Amazon does not provide prep service in this region.</div>
        </div>
      </div>
      <div class="modal-foot"><a class="small" style="margin-right:auto" data-act="close-modal">Delete packing template</a><button class="btn dark" data-act="close-modal">Close</button><button class="btn disabled" disabled>Save</button></div>
    </div>`);
  }

  function boxesModal(n) {
    const s = D.SHIPMENTS.find(x => x.n === n);
    const skuIdx = (W().skus && W().skus.length) ? W().skus : [0, 1];
    const boxes = Array.from({ length: s.boxes }, (_, k) => {
      const p = D.PRODUCTS[skuIdx[k % skuIdx.length]];
      return `
      <div class="bx">
        <div class="bx-top">
          <div class="bx-id">
            <div class="b small">Box ID: ${s.id}U${String(k + 1).padStart(6, "0")}</div>
            <div class="tiny muted" style="margin-top:3px">${p.asin}</div>
          </div>
          <div class="bx-measures">
            <div class="bx-field"><span class="bx-lbl">Weight:</span><input class="bx-inp" style="width:52px" value="${p.boxWeight}"${k === 0 ? ' data-tour="box-weight"' : ''}><span class="bx-unit">lb</span></div>
            <div class="bx-field"><span class="bx-lbl">Dimensions:</span><input class="bx-inp" style="width:44px" value="${p.boxDims[0]}"><span class="bx-x">x</span><input class="bx-inp" style="width:44px" value="${p.boxDims[1]}"><span class="bx-x">x</span><input class="bx-inp" style="width:44px" value="${p.boxDims[2]}"><span class="bx-unit">inch</span></div>
            <button class="bx-trash" title="Remove box" aria-label="Remove box">${TRASH}</button>
          </div>
        </div>
        <div class="bx-rowhead">
          <span class="b">SKUs in box: 1 (1 units)</span>
          <span>Information or action</span>
          <span>Expected quantity</span>
          <span>Updated quantity</span>
        </div>
        <div class="bx-prod">
          <div class="prod"><div class="thumb"></div><div class="pcol">
            <a class="pname" style="font-size:12.5px;line-height:1.45">${esc(p.name)}</a>
            <div class="pmeta kvline"><div>SKU: ${p.sku}</div><div>ASIN: ${p.asin}</div></div>
          </div></div>
          <div class="small">Prep required: <span class="muted">No prep required</span></div>
          <div class="small">1</div>
          <div><input class="inp sm" style="width:68px" value="1"></div>
        </div>
      </div>`;
    }).join("");

    return A.el(`<div class="modal wide bxmodal">
      <div class="modal-head"><h3>${esc(shipName(s))}</h3><span class="x" data-act="close-modal">&#10005;</span></div>
      <div class="modal-body">
        <div class="bx-summary">
          <div class="bx-sum-col">
            <div class="bx-sline"><span class="k">Ship to:</span> <b>${s.fc} — ${esc(s.addr)}</b></div>
            <div class="bx-sline"><span class="k">Ship from:</span> <b>${esc(addr().oneLine)}</b></div>
            <div class="bx-sline"><span class="k">Method:</span> <b>Less than and full truckload (LTL/FTL)</b></div>
            <div class="bx-sline"><span class="k">Shipment ID:</span> <b>${s.id}</b></div>
            <div class="bx-sline"><span class="k">Shipment name:</span> <b>${esc(shipName(s))}</b></div>
          </div>
          <div class="bx-sum-col">
            <div class="bx-sline bx-counts"><b>Boxes: ${s.boxes}</b><b>SKUs: ${s.skus}</b><b>Units: ${s.units}</b></div>
            <div class="bx-sline">SKUs with expiration date: <b>0</b> (0 units)</div>
            <div class="bx-sline">SKUs that need labeling by seller: <b>0</b> (0 units)</div>
            <div class="bx-sline">SKUs that need prepping by seller: <b>${s.skus}</b> (${s.units} units)</div>
            <button class="btn dark split" style="margin-top:12px;align-self:flex-start">Print pack list.csv <span class="div"></span>${DCARET}</button>
          </div>
        </div>
        <div class="bx-tabs">
          <div class="bx-tab on">All boxes (${s.boxes})</div>
          <div class="bx-search">
            <input class="inp sm" placeholder="Search by box ID" style="height:36px;width:230px;border-radius:7px 0 0 7px">
            <button class="btn sm search-btn" style="height:36px;border-radius:0 7px 7px 0;padding:0 14px" aria-label="Search">${SEARCHIC}</button>
          </div>
        </div>
        <div class="bx-list">${boxes}</div>
      </div>
      <div class="modal-foot"><a class="small" data-act="close-modal">Cancel</a><button class="btn primary" data-act="close-modal">Validate updates</button></div>
    </div>`);
  }
})();
