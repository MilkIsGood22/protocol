// usage: node shot.js <html file> <query string> <out.png>
const path = require("path");
const { chromium } = require(path.join("/home/claude/build/node_modules", "playwright"));
(async () => {
  const [file, query, out] = process.argv.slice(2);
  const b = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"],
  });
  const p = await b.newPage({ viewport: { width: 1200, height: 700 }, deviceScaleFactor: Number(process.env.DSF || 1) });
  const errs = [];
  p.on("pageerror", e => errs.push(String(e).slice(0, 400)));
  p.on("console", m => { if (m.type() === "error") errs.push(m.text().slice(0, 300)); });
  await p.goto("file://" + file + "?" + (query || ""));
  await p.waitForFunction("window.__done === true", null, { timeout: 30000 }).catch(() => errs.push("timeout waiting for sheet"));
  await p.waitForTimeout(250);
  const checks = await p.evaluate("window.__checks || []");
  if (out && out !== "none") {
    const el = await p.$("#root > div");
    if (el) await el.screenshot({ path: out }); else await p.screenshot({ path: out, fullPage: true });
  }
  await b.close();
  if (errs.length) console.log("ERRORS:\n  " + errs.join("\n  "));
  console.log(checks.length ? "CHECKS:\n  " + checks.join("\n  ") : "CHECKS: clean");
})();
