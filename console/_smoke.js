/* ============================================================
   Tutorial smoke check (dev tool, no framework). Best run from the library
   landing page:  smokeTutorials()  in the browser console. It walks every step
   of every tutorial, applies the step's scenario/pre into an OFF-SCREEN node,
   and asserts the spotlight target resolves to a visible element. This is the
   guard against the exact failure that bit us before: a Demo edit silently
   orphaning a data-tour anchor (e.g. the old [data-sec="inventory"]). Returns an
   array of problems (empty = all good) and prints a table.

   It renders into a throwaway node and restores the live render target before
   returning, so it never freezes an open tutorial. (It does reset App.state as
   cleanup; reopening a tutorial re-establishes state via Guide.start.)
   ============================================================ */
window.smokeTutorials = function () {
  const liveRoot = App.getRoot();            // remember the live mount (null on the library page)
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:0;top:0;width:1280px;height:900px;opacity:0;pointer-events:none;z-index:-1;overflow:hidden";
  const app = document.createElement("div");
  host.appendChild(app);
  document.body.appendChild(host);
  App.setRoot(app);                          // render into the off-screen node (no listener binding)

  const problems = [];
  Object.values(window.TUTORIALS).forEach(t => {
    if (!t.steps) return;
    t.steps.forEach((s, i) => {
      let error = null;
      try { if (s.scenario) App.setScenario(s.scenario); if (s.pre) s.pre(); }
      catch (e) { error = String(e); }
      let found = true, visible = true;
      if (s.target) {
        const el = app.querySelector(s.target);
        found = !!el;
        const r = el && el.getBoundingClientRect();
        visible = !!(el && r.width > 0 && r.height > 0);
      }
      if (error || !found || !visible)
        problems.push({ tutorial: t.id, step: i, title: s.title, target: s.target || "(centered)", found, visible, error });
    });
  });

  App.reset();
  App.setRoot(liveRoot);                      // restore the live mount — never leave it dangling
  host.remove();

  if (problems.length) {
    console.error("✗ Tutorial smoke check — " + problems.length + " problem(s):");
    if (console.table) console.table(problems); else console.error(problems);
  } else {
    const n = Object.values(window.TUTORIALS).reduce((a, t) => a + (t.steps ? t.steps.length : 0), 0);
    console.log("✓ Tutorial smoke check passed — all " + n + " steps resolve a visible spotlight target.");
  }
  return problems;
};

console.log("%cdev: run smokeTutorials() to verify every tutorial step's anchor resolves.", "color:#888");
