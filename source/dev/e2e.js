// End-to-end check of protocol.html in headless Chromium at phone size.
//   node e2e.js /mnt/user-data/outputs/protocol.html /home/claude/work/e2e
const { chromium } = require("/home/claude/build/node_modules/playwright");
const path = require("path"), fs = require("fs");
const [, , file, outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] }).catch(() => chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] }));
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  page.on("dialog", d => d.accept("Test question"));
  await page.goto("file://" + file + "?steps=4321");
  await page.waitForTimeout(1200);
  let n = 0;
  const shot = async name => { n++; await page.screenshot({ path: path.join(outDir, `${String(n).padStart(2, "0")}-${name}.png`), fullPage: false }); };
  const ok = [];
  const check = (c, msg) => { ok.push((c ? "PASS " : "FAIL ") + msg); };
  const tab = async t => { await page.locator("nav button", { hasText: t }).click(); await page.waitForTimeout(500); };
  const text = async () => page.locator("body").innerText();

  // Today
  await shot("today");
  let t = await text();
  check(/days to|day to|Today/.test(t), "event badge shows");
  check(t.includes("Move of the day"), "move of the day");
  check((await page.locator("canvas").count()) > 0, "animation canvas on Today");
  await page.fill("input[type=number] >> nth=0", "151.2");
  await page.keyboard.type("4");
  const wv = await page.inputValue("input[type=number] >> nth=0");
  check(wv === "151.24", "weight input keeps focus while typing (" + wv + ")");
  await page.locator("button", { hasText: "Dinner" }).click();
  await page.mouse.wheel(0, 900); await page.waitForTimeout(300);
  await shot("today-scrolled");

  // Train
  await tab("Train");
  await shot("train");
  await page.locator("button", { hasText: "Monday" }).first().click();
  await page.waitForTimeout(300);
  t = await text();
  check(t.includes("Changes here repeat every week"), "day editor opens");
  await shot("day-editor");
  await page.locator("button[aria-label=Close]").last().click();
  await page.waitForTimeout(200);
  // long press a block
  const blk = page.locator("button", { hasText: "Teens/Adults Gi" }).first();
  const bb = await blk.boundingBox();
  await page.mouse.move(bb.x + 20, bb.y + 8); await page.mouse.down(); await page.waitForTimeout(800); await page.mouse.up();
  await page.waitForTimeout(300);
  t = await text();
  check(t.includes("Skip it once"), "long-press opens block menu");
  await shot("block-menu");
  await page.locator("button", { hasText: "Skip it once" }).click();
  await page.waitForTimeout(300);
  t = await text();
  check(t.includes("skipped once"), "skip once marks the block");

  // Solo drill form loops
  await page.locator("button", { hasText: "Solo drill block" }).click();
  await page.waitForTimeout(300);
  await page.locator("button", { hasText: "▶ Form" }).first().click();
  await page.waitForTimeout(1000);
  check((await page.locator(".fixed canvas").count()) > 0, "solo drill form animation");
  await shot("drill-form");
  await page.locator("button[aria-label=Close]").last().click();
  await page.waitForTimeout(200);

  // Library: cards
  await tab("Library");
  await shot("library-cards");
  t = await text();
  check(t.includes("animated"), "animated badge in list");
  check(t.includes("Trap and roll") && t.includes("Side control escape to half guard"), "new escape cards in library");
  check(t.includes("More animated moves"), "more animated moves section");
  await page.locator("button", { hasText: "Scissor sweep" }).first().click();
  await page.waitForTimeout(1200);
  check((await page.locator(".fixed canvas").count()) > 0, "extra animation plays from library");
  await shot("extra-scissor");
  await page.locator("button[aria-label=Close]").last().click();
  await page.waitForTimeout(200);
  await page.locator("text=Trap and roll (mount escape)").first().click();
  await page.waitForTimeout(1200);
  await shot("card-traproll");
  check((await page.locator(".fixed canvas").count()) > 0, "trap and roll card animates");
  await page.locator("button[aria-label=Close]").last().click();
  await page.waitForTimeout(200);
  await page.locator("text=Kimura from closed guard").first().click();
  await page.waitForTimeout(1500);
  await shot("card-kimura");
  t = await text();
  check(t.includes("Edit the pose"), "card shows animation + pose edit link");
  await page.locator("button", { hasText: "Mistake" }).first().click();
  await page.waitForTimeout(800);
  await shot("card-mistake");
  await page.locator("button", { hasText: "Back to the move" }).click();
  await page.locator("text=Edit the pose").click();
  await page.waitForTimeout(800);
  await shot("pose-editor");
  const circ = page.locator("div.fixed").last().locator("svg circle").first();
  const cb = await circ.boundingBox();
  if (cb) { await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await page.mouse.down(); await page.mouse.move(cb.x + 40, cb.y - 20, { steps: 5 }); await page.mouse.up(); }
  await page.waitForTimeout(300);
  await shot("pose-dragged");
  await page.locator("button", { hasText: "Save" }).last().click();
  await page.waitForTimeout(400);
  t = await text();
  check(t.includes("Pose edited by you"), "pose edit saved");
  await page.locator("button", { hasText: "Edit steps and cue" }).click();
  await page.waitForTimeout(300);
  check((await text()).includes("Swap in the video"), "card editor opens");
  await page.locator("button", { hasText: "Cancel" }).click();
  await page.locator("button[aria-label=Close]").last().click();
  await page.waitForTimeout(300);

  // Library: tree
  await page.locator("button", { hasText: "Move tree" }).click();
  await page.waitForTimeout(500);
  await shot("tree");
  t = await text();
  check(/\d+ moves/.test(t), "tree shows move count");
  await page.locator("button", { hasText: "Guards (you on the bottom)" }).click();
  await page.locator("button", { hasText: "Closed guard" }).first().click();
  await page.waitForTimeout(500);
  await shot("tree-node-sheet");
  await page.locator("button[aria-label=Close]").last().click();
  await page.waitForTimeout(200);
  await shot("tree-open");
  await page.fill("input[placeholder^='Search']", "heel hook");
  await page.waitForTimeout(400);
  await shot("tree-search");
  t = await text();
  check(t.includes("Inside heel hook"), "tree search finds heel hook");
  await page.locator("button", { hasText: "Inside heel hook" }).first().click();
  await page.waitForTimeout(400);
  t = await text();
  check(t.includes("Legal check") && t.includes("YouTube"), "tree sheet shows legal check + youtube");
  await shot("tree-sheet");
  await page.locator("button", { hasText: "Add to my library" }).click();
  await page.waitForTimeout(400);
  t = await text();
  check(t.includes("Open the card"), "add to library works");
  await page.locator("button[aria-label=Close]").last().click();
  await page.fill("input[placeholder^='Search']", "armbar");
  await page.waitForTimeout(300);
  await page.locator("button:has(span:text-is('Armbar'))").first().click();
  await page.waitForTimeout(1200);
  await shot("tree-armbar");
  check((await page.locator(".fixed canvas").count()) > 0, "tree sheet plays the animation for a library move");
  await page.locator("button[aria-label=Close]").last().click();

  // Library: map
  await page.locator("button", { hasText: "Map & plan" }).click();
  await page.waitForTimeout(1500);
  await shot("map");
  check((await page.locator("main canvas").count()) >= 7, "position map tiles have stills");

  // Body
  await tab("Body");
  await shot("body");
  t = await text();
  check(t.includes("4321"), "steps from URL parameter");

  // Review
  await tab("Review");
  await shot("review");
  await page.locator("main button", { hasText: /^1$/ }).first().click().catch(() => {});
  await page.waitForTimeout(300);
  await shot("daylog");
  await page.locator("button[aria-label=Close]").last().click().catch(() => {});
  t = await text();
  check(t.includes("Film room"), "film room section");
  check(t.includes("classes"), "monthly totals");

  // Settings
  await tab("Today");
  await page.locator("button[aria-label=Settings]").click();
  await page.waitForTimeout(300);
  await shot("settings");

  const ls = await page.evaluate(() => JSON.parse(localStorage.getItem("protocol-v2") || "{}"));
  check(ls.poseEdits && ls.poseEdits.kimura, "pose edits stored for backup");
  check(Object.values(ls.cards || {}).some(c => c.custom && c.n === "Inside heel hook"), "custom card stored");

  console.log(ok.join("\n"));
  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no page errors");
  await browser.close();
})();
