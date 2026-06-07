/* ============================================================
   Tutorial library — shared scaffolding. Loaded BEFORE any tutorial file.

   Each tutorial lives in its own console/tutorials/<id>.js and registers
   itself into window.TUTORIALS (one tutorial per file; do NOT split a single
   tutorial's steps across files). New tutorial? Add a file here and a matching
   <script> in index.html — the library grid and guide engine pick it up
   automatically via Object.values(window.TUTORIALS).

   `steps` drives the guide engine; entries without `steps` show as
   "Coming soon" cards in the library. Step fields:
     mkey      milestone key — which rail node this step lives under
     sub       optional sub-step code (e.g. "1a") → renders a branch pill
     subLabel  label for that sub pill
     chip      brand eyebrow shown on the coach card
     target    data-tour selector to spotlight ('' = centered intro)
     side      preferred coach side: right|left|top|bottom|center
     title,body,tip
     action    'click' (advance when the highlighted control is clicked)
               | 'next' (advance with the coach Next button)
     scenario  declarative console state the step needs — handed to
               App.setScenario (the Demo owns how to realize it). Preferred
               over pre(); safe to enter out of order / jump to.
     pre()     imperative escape hatch for setup scenario can't express
               (e.g. App.reset). Runs AFTER scenario.
     onNext()  optional: run when advancing a 'next' step
   ============================================================ */
window.TUTORIALS = window.TUTORIALS || {};

window.TutorialKit = (function () {
  const A = window.App;

  /* Build a Send-to-Amazon scenario for a step: the wizard fields the step
     needs, layered on the shared baseline (two SKUs selected, boxes filled,
     "All FBA SKUs" tab). `modal` optionally opens a modal. This is the data the
     engine hands to App.setScenario — tutorials never touch wizard internals or
     fake action calls; the Demo (send-to-fc.js) owns how each field is realized. */
  function sendfc(wizard, modal) {
    return {
      page: "sendfc", menuOpen: false, menuExpand: null, groupOpen: false,
      wizard: Object.assign({ qtyDefault: 20, ready: "all", activeTab: "all" }, wizard),
      modal: modal || null,
    };
  }

  /* The one way to add a tutorial — keeps registration uniform and guards the
     tutorial↔tutorial collision (two files claiming the same id would otherwise
     silently overwrite each other). */
  function register(def) {
    if (!def || !def.id) { console.error("registerTutorial: missing id", def); return def; }
    if (window.TUTORIALS[def.id]) console.warn("registerTutorial: duplicate id '" + def.id + "' — overwriting");
    window.TUTORIALS[def.id] = def;
    return def;
  }

  return { A, sendfc, register };
})();
