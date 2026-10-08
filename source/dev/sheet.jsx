
/* contact sheet for checking poses: ?moves=a,b&views=angle,top&cols=6&f=1,2,m&w=340 */
RIG_CHECK = true;
function Sheet() {
  const q = new URLSearchParams(location.search);
  const ids = (q.get("moves") || Object.keys(anims).join(",")).split(",").filter(Boolean);
  const views = (q.get("views") || "angle").split(",");
  const cols = Number(q.get("cols") || 6);
  const only = q.get("f") ? q.get("f").split(",") : null;
  const w = Number(q.get("w") || 300);
  const marks = q.get("marks") !== "0";
  const lines = [];
  const blocks = ids.map(id => {
    const cm = compileMove(id);
    if (!cm) { lines.push(`!! no move "${id}"`); return null; }
    const list = [];
    cm.frames.forEach((f, i) => { if (!only || only.includes(String(i + 1))) list.push({ f, n: String(i + 1) + (f.via ? "v" : "") }); });
    if (cm.mistake && (!only || only.includes("m"))) list.push({ f: cm.mistake, n: "✗" });
    list.forEach(({ f, n }) => (f.checks || []).forEach(c => lines.push(`${id} [${n}] ${c}`)));
    return (
      <div key={id} style={{ marginBottom: 10 }}>
        {views.map(vn => {
          let yaw = null, pitch = null;
          if (vn === "side") { yaw = 0; pitch = 7; }
          else if (vn === "top") { yaw = 0; pitch = 84; }
          else if (vn === "front") { yaw = 90; pitch = 10; }
          else if (vn === "back") { yaw = 180; pitch = 7; }
          else if (/^y-?\d+p\d+$/.test(vn)) { const mm = vn.match(/^y(-?\d+)p(\d+)$/); yaw = Number(mm[1]); pitch = Number(mm[2]); }
          return (
            <div key={vn} style={{ marginBottom: 6 }}>
              <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 700, margin: "2px 0 4px" }}>{id} · {vn}{vn === "angle" ? ` (yaw ${cm.yaw}, pitch ${cm.pitch})` : ""}</div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${w}px)`, gap: 5 }}>
                {list.map(({ f, n }) => (
                  <div key={n} style={{ border: `1px solid ${n === "✗" ? "#7f1d1d" : "#1e293b"}`, borderRadius: 6, overflow: "hidden", width: w }}>
                    <RigStill cm={cm} fr={f} yaw={yaw} pitch={pitch} marks={marks && vn === "angle"} dim={false} who={n === "1"} />
                    <div style={{ color: n === "✗" ? "#fca5a5" : "#cbd5e1", fontSize: 10, padding: "3px 6px", background: "#0f172a", lineHeight: 1.25 }}>{n}. {f.cap}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  });
  useEffect(() => { window.__checks = lines; window.__done = true; }, []);
  return <div style={{ background: "#020617", padding: 10, fontFamily: "system-ui", width: cols * (w + 5) + 20 }}>{blocks}</div>;
}
createRoot(document.getElementById("root")).render(<Sheet />);
