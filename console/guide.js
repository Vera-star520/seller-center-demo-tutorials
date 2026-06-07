/* ============================================================
   Guide engine — wraps the LIVE console with the loved tutorial
   experience: two-level rail · immersive spotlight · brand coach ·
   guide ↔ browse modes (browse = page fully clickable).
   ============================================================ */
window.Guide = (function () {
  let cur = null, idx = 0, active = false, host = null, onExit = null;
  let mode = "guide";                 // "guide" | "browse"
  let player, appEl, mrow, pfill, layer, ring, coach, entry, entryTip;
  let strips = {}, groups = [];
  let repT = null, hooked = false;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const railLabel = k => (cur.rail && cur.rail.label[k]) || k;
  const railGlyph = k => (cur.rail && cur.rail.glyph[k]) || k;
  const stepLabel = s => s.mkey === "start" ? "Start" : s.mkey === "done" ? "Final step" : "Step " + s.mkey;

  /* ---------------- build rail model ---------------- */
  function buildGroups() {
    groups = [];
    cur.steps.forEach((s, i) => {
      let g = groups[groups.length - 1];
      if (!g || g.key !== s.mkey) { g = { key: s.mkey, steps: [], subMap: {}, subOrder: [] }; groups.push(g); }
      g.steps.push(i);
      if (s.sub) {
        if (!(s.sub in g.subMap)) { g.subMap[s.sub] = { code: s.sub, label: s.subLabel || s.sub, first: i, last: i }; g.subOrder.push(s.sub); }
        g.subMap[s.sub].last = i;
      }
    });
  }
  function groupOf(stepIdx) { return groups.findIndex(g => g.steps.includes(stepIdx)); }

  /* ---------------- player chrome ---------------- */
  function buildPlayer() {
    buildGroups();
    host.innerHTML = `
      <div class="player" style="display:flex;flex-direction:column;height:100vh">
        <div class="tut-bar">
          <img src="${(window.__resources && window.__resources.fbabeeLogo) || 'console/fbabee-logo.png'}" alt="FBABEE" />
          <div class="divider"></div>
          <div class="t-title">${cur.title}</div>
          <div class="t-right">
            <span class="count" id="gCount"></span>
            <span class="back" id="gRestart">&#8635; Restart</span>
            <span class="back" id="gBack">&#8592; All tutorials</span>
          </div>
        </div>
        <nav class="rail"><div class="mrow" id="gRow"><div class="pfill" id="gFill"></div></div></nav>
        <div class="stage">
          <div class="browser">
            <div class="chrome">
              <div class="dots"><i></i><i></i><i></i></div>
              <div class="url"><span class="lock">&#128274;</span> sellercentral.amazon.com/fba/sendtoamazon</div>
            </div>
            <div id="app"></div>
          </div>
        </div>
      </div>`;
    player = host.querySelector(".player");
    appEl = host.querySelector("#app");
    mrow = host.querySelector("#gRow");
    pfill = host.querySelector("#gFill");

    // rail nodes + branch sub-pills
    mrow.insertAdjacentHTML("beforeend", groups.map((g, gi) => {
      const subs = g.subOrder.length
        ? `<div class="subs">${g.subOrder.map(code => {
            const sub = g.subMap[code];
            return `<button class="subpill" data-n="${sub.first}"><span class="snum">${code}</span><span class="slbl">${sub.label}</span></button>`;
          }).join("")}</div>`
        : "";
      return `<div class="mcol" data-g="${gi}"><button class="pnode" data-first="${g.steps[0]}"><span class="ball">${railGlyph(g.key)}</span><span class="plbl">${railLabel(g.key)}</span></button>${subs}</div>`;
    }).join(""));
    mrow.querySelectorAll(".pnode").forEach(n => n.addEventListener("click", () => go(+n.dataset.first)));
    mrow.querySelectorAll(".subpill").forEach(p => p.addEventListener("click", () => go(+p.dataset.n)));

    host.querySelector("#gBack").addEventListener("click", exit);
    host.querySelector("#gRestart").addEventListener("click", restart);

    buildOverlay();
  }

  function buildOverlay() {
    player.querySelector(".spot-layer")?.remove();
    player.querySelector(".coach")?.remove();
    player.querySelector(".entry")?.remove();
    player.querySelector(".entry-tip")?.remove();
    player.querySelector(".paused")?.remove();
    player.querySelector(".hintkeys")?.remove();

    layer = document.createElement("div");
    layer.className = "spot-layer";
    layer.innerHTML = `
      <div class="spot-strip" data-s="t"></div><div class="spot-strip" data-s="b"></div>
      <div class="spot-strip" data-s="l"></div><div class="spot-strip" data-s="r"></div>
      <div class="spot-ring"></div>`;
    player.appendChild(layer);
    strips = {
      t: layer.querySelector('[data-s="t"]'), b: layer.querySelector('[data-s="b"]'),
      l: layer.querySelector('[data-s="l"]'), r: layer.querySelector('[data-s="r"]'),
    };
    ring = layer.querySelector(".spot-ring");
    layer.querySelectorAll(".spot-strip").forEach(s => s.addEventListener("click", () => setMode("browse")));

    coach = document.createElement("div"); coach.className = "coach"; player.appendChild(coach);
    entry = document.createElement("button"); entry.className = "entry"; entry.setAttribute("aria-label", "Resume this step");
    entry.addEventListener("click", () => setMode("guide")); player.appendChild(entry);
    entryTip = document.createElement("div"); entryTip.className = "entry-tip"; player.appendChild(entryTip);

    const paused = document.createElement("div");
    paused.className = "paused";
    paused.innerHTML = `<span class="dot"></span><span>Browsing freely — tap the glowing dot, or pick a step above</span><button class="resume">Resume &#8250;</button>`;
    paused.querySelector(".resume").addEventListener("click", () => setMode("guide"));
    player.appendChild(paused);

    const keys = document.createElement("div");
    keys.className = "hintkeys";
    keys.innerHTML = `Use <b>&#8592;</b> <b>&#8594;</b> to move · click outside or press <b>Esc</b> to explore`;
    player.appendChild(keys);
  }

  /* ---------------- lifecycle ---------------- */
  function start(id, hostEl, exitCb) {
    cur = window.TUTORIALS[id];
    if (!cur || !cur.steps) return;
    host = hostEl; onExit = exitCb; idx = 0; active = true; mode = "guide";
    buildPlayer();
    App.reset();
    App.mount(appEl);
    if (!hooked) { App.onRender(() => { if (active) requestAnimationFrame(position); }); hooked = true; }
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", repos);
    document.addEventListener("scroll", repos, true);
    show();
  }

  function exit() {
    active = false;
    document.removeEventListener("click", onDocClick, true);
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", repos);
    document.removeEventListener("scroll", repos, true);
    player.querySelector(".done-scrim")?.remove();
    if (onExit) onExit();
  }

  function restart() {
    player.querySelector(".done-scrim")?.remove();
    App.reset(); idx = 0; active = true; go(0, true);
  }

  /* ---------------- step navigation ---------------- */
  function go(n, forceGuide) {
    n = clamp(n, 0, cur.steps.length - 1);
    // Preserve the current mode when navigating. In Free Browse, jumping via the
    // rail relocates the breathing dot to the new step's target but stays in
    // browse — the user taps the dot to enter Spotlight. Only forced calls
    // (restart, breathing-dot resume) switch into guide.
    const target = forceGuide ? "guide" : mode;
    if (n === idx && target === "guide" && mode === "guide" && active) return;
    idx = n;
    active = true;
    setMode(target);
    show();
  }
  function next() { if (idx < cur.steps.length - 1) go(idx + 1); else complete(); }

  function show() {
    const step = cur.steps[idx];
    if (step.pre) step.pre();
    updateRail();
    renderCoach(step);
    const settle = () => { if (!active) return; scrollTargetIntoView(step); position(); };
    requestAnimationFrame(() => requestAnimationFrame(settle));
    setTimeout(settle, 90);
    setTimeout(() => active && position(), 260);
  }

  function updateRail() {
    const N = groups.length, cg = groupOf(idx), step = cur.steps[idx];
    const inset = 50 / N;
    mrow.style.setProperty("--rail-inset", inset + "%");
    pfill.style.width = N > 1 ? `calc((100% - ${2 * inset}%) * ${cg / (N - 1)})` : "0";
    mrow.querySelectorAll(".mcol").forEach((col, gi) => {
      col.classList.toggle("active", gi === cg);
      col.classList.toggle("done", gi < cg);
    });
    mrow.querySelectorAll(".subpill").forEach(p => {
      const n = +p.dataset.n, g = groups[groupOf(n)];
      const code = cur.steps[n].sub, sub = g.subMap[code];
      p.classList.toggle("active", step.sub === code && groupOf(n) === cg);
      p.classList.toggle("done", groupOf(n) < cg || (groupOf(n) === cg && sub.last < idx));
    });
    host.querySelector("#gCount").textContent = `${stepLabel(step)} · ${idx + 1} of ${cur.steps.length}`;
  }

  function renderCoach(step) {
    const last = idx === cur.steps.length - 1;
    coach.innerHTML = `
      <div class="arrow"></div>
      <button class="close" id="gClose" aria-label="Browse freely">&#10005;</button>
      <span class="chip">${step.chip || stepLabel(step)}</span>
      <h4>${step.title}</h4>
      <p>${step.body}</p>
      ${step.tip ? `<div class="tip"><span class="b">&#10038;</span><div>${step.tip}</div></div>` : ""}
      <div class="actions">
        ${idx > 0 ? `<button class="cbtn prev" id="gPrev">&#8249; Back</button>` : ""}
        <span class="sp"></span>
        ${step.action === "click"
          ? `<span class="cue"><span class="pt">&#9758;</span> Click the highlighted control</span>`
          : `<button class="cbtn next" id="gNext">${last ? "Finish &#10003;" : "Next &#8250;"}</button>`}
      </div>`;
    coach.querySelector("#gClose").addEventListener("click", () => setMode("browse"));
    const pv = coach.querySelector("#gPrev"); if (pv) pv.addEventListener("click", () => go(idx - 1));
    const nx = coach.querySelector("#gNext");
    if (nx) nx.addEventListener("click", () => { if (step.onNext) step.onNext(); next(); });
  }

  /* ---------------- modes ---------------- */
  function setMode(m) {
    mode = m;
    player.classList.toggle("browse", m === "browse");
    if (m === "browse") { layer.style.display = "none"; coach.style.display = "none"; ring.classList.remove("pulse"); }
    else { layer.style.display = ""; coach.style.display = ""; }
    position();
  }

  /* ---------------- spotlight + coach placement ---------------- */
  function scrollTargetIntoView(step) {
    if (!step.target) return;
    const tgt = document.querySelector(step.target);
    const sc = appEl.querySelector("#pageScroll");
    if (!tgt || !sc) return;
    const tr = tgt.getBoundingClientRect(), cr = sc.getBoundingClientRect();
    if (tr.top < cr.top + 80) sc.scrollTop += tr.top - cr.top - 100;
    else if (tr.bottom > cr.bottom - 28) sc.scrollTop += tr.bottom - cr.bottom + 80;
  }
  function repos() { clearTimeout(repT); repT = setTimeout(() => active && position(), 16); }

  function setStrip(s, x, y, w, h) {
    s.style.left = x + "px"; s.style.top = y + "px";
    s.style.width = Math.max(0, w) + "px"; s.style.height = Math.max(0, h) + "px";
  }
  function fullDim(vw, vh) {
    setStrip(strips.t, 0, 0, vw, vh); setStrip(strips.b, 0, 0, 0, 0);
    setStrip(strips.l, 0, 0, 0, 0); setStrip(strips.r, 0, 0, 0, 0);
    ring.style.opacity = "0"; ring.classList.remove("pulse");
  }

  function position() {
    if (!active) return;
    const step = cur.steps[idx];
    const vw = window.innerWidth, vh = window.innerHeight;
    const tgt = step.target ? document.querySelector(step.target) : null;
    if (!tgt) { fullDim(vw, vh); entry.style.left = "-9999px"; entryTip.style.left = "-9999px"; placeCoach(null); return; }

    const r = tgt.getBoundingClientRect();
    const padX = 6, padY = 5;
    const hx = Math.max(0, r.left - padX), hy = Math.max(0, r.top - padY);
    const hw = r.width + padX * 2, hh = r.height + padY * 2;
    setStrip(strips.t, 0, 0, vw, hy);
    setStrip(strips.b, 0, hy + hh, vw, vh - (hy + hh));
    setStrip(strips.l, 0, hy, hx, hh);
    setStrip(strips.r, hx + hw, hy, vw - (hx + hw), hh);
    ring.style.opacity = "1";
    ring.style.left = hx + "px"; ring.style.top = hy + "px";
    ring.style.width = hw + "px"; ring.style.height = hh + "px";
    if (mode === "guide") ring.classList.add("pulse");

    const k = { left: hx, top: hy, right: hx + hw, bottom: hy + hh, width: hw, height: hh };
    placeCoach(k);
    placeEntry(k, step);
  }

  function placeEntry(k, step) {
    const cx = k.left + k.width / 2, cy = k.top + k.height / 2;
    entry.style.left = (cx - 15) + "px"; entry.style.top = (cy - 15) + "px";
    entryTip.textContent = stepLabel(step) + ": " + step.title;
    entryTip.style.left = clamp(cx, 100, window.innerWidth - 100) + "px";
    entryTip.style.top = (cy + 24) + "px";
  }

  function placeCoach(k) {
    const cw = coach.offsetWidth || 330, ch = coach.offsetHeight || 260;
    const vw = window.innerWidth, vh = window.innerHeight, gap = 18, m = 14, topMin = 150;
    if (!k) {
      coach.style.removeProperty("--ax"); coach.style.removeProperty("--ay");
      coach.style.left = (vw - cw) / 2 + "px";
      coach.style.top = Math.max(topMin, (vh - ch) / 2) + "px";
      coach.className = "coach ar-none";
      return;
    }
    const clampX = x => clamp(x, m, vw - cw - m);
    const clampY = y => clamp(y, topMin, vh - ch - m);
    const wide = k.width > Math.min(560, vw * 0.46);
    const fitsRight = k.right + gap + cw <= vw - m;
    const fitsLeft = k.left - gap - cw >= m;
    const fitsBelow = k.bottom + gap + ch <= vh - m;
    const fitsAbove = k.top - gap - ch >= topMin;
    let left, top, cls;
    if (!wide && fitsRight) { left = k.right + gap; top = clampY(k.top + k.height / 2 - ch / 2); cls = "ar-left"; }
    else if (!wide && fitsLeft) { left = k.left - gap - cw; top = clampY(k.top + k.height / 2 - ch / 2); cls = "ar-right"; }
    else if (fitsBelow) { left = clampX(k.left + k.width / 2 - cw / 2); top = k.bottom + gap; cls = "ar-top"; }
    else if (fitsAbove) { left = clampX(k.left + k.width / 2 - cw / 2); top = k.top - gap - ch; cls = "ar-bottom"; }
    else if (fitsRight) { left = k.right + gap; top = clampY(k.top + k.height / 2 - ch / 2); cls = "ar-left"; }
    else { left = clampX(k.left + k.width / 2 - cw / 2); top = clampY(k.top + k.height / 2 - ch / 2); cls = "ar-none"; }
    if (cls === "ar-top" || cls === "ar-bottom") {
      coach.style.setProperty("--ax", clamp(k.left + k.width / 2 - left, 20, cw - 20) + "px");
      coach.style.removeProperty("--ay");
    } else if (cls === "ar-left" || cls === "ar-right") {
      coach.style.setProperty("--ay", clamp(k.top + k.height / 2 - top, 20, ch - 20) + "px");
      coach.style.removeProperty("--ax");
    }
    coach.style.left = left + "px"; coach.style.top = top + "px";
    coach.className = "coach " + cls;
  }

  /* ---------------- click → advance (guide mode) ---------------- */
  function onDocClick(e) {
    if (!active || mode !== "guide") return;
    if (e.target.closest(".coach, .tut-bar, .rail, .done-scrim, .spot-strip")) return;
    const step = cur.steps[idx];
    if (step.action !== "click" || !step.target) return;
    const tgt = document.querySelector(step.target);
    if (tgt && (e.target === tgt || tgt.contains(e.target))) {
      setTimeout(() => { if (active && cur.steps[idx] === step) next(); }, 130);
    }
  }
  function onKey(e) {
    if (!active) return;
    if (e.key === "ArrowRight") go(idx + 1);
    else if (e.key === "ArrowLeft") go(idx - 1);
    else if (e.key === "Escape") { if (mode === "guide") setMode("browse"); }
  }

  /* ---------------- completion ---------------- */
  function complete() {
    if (player.querySelector(".done-scrim")) return;
    active = false;
    layer.style.display = "none"; coach.style.display = "none";
    mrow.querySelectorAll(".mcol").forEach(c => { c.classList.add("done"); c.classList.remove("active"); });
    mrow.querySelectorAll(".subpill").forEach(p => { p.classList.add("done"); p.classList.remove("active"); });
    pfill.style.width = "calc(100% - " + (100 / groups.length) + "%)";
    const scrim = document.createElement("div");
    scrim.className = "done-scrim";
    scrim.innerHTML = `
      <div class="done-card">
        <div class="seal">&#10003;</div>
        <h2>Plan complete!</h2>
        <p>You've walked through the full <b>${cur.title}</b> flow — from selecting inventory to entering tracking. You're ready to do it for real.</p>
        <div class="done-actions">
          <button class="btn primary" id="gAgain">Run it again</button>
          <button class="btn ghost" id="gLib">Back to all tutorials</button>
        </div>
      </div>`;
    player.appendChild(scrim);
    scrim.querySelector("#gAgain").addEventListener("click", () => { scrim.remove(); restart(); });
    scrim.querySelector("#gLib").addEventListener("click", () => { scrim.remove(); exit(); });
  }

  return { start, complete, exit, restart };
})();
