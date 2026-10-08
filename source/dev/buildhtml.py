"""Inline the CSS and JS bundle into one HTML file with home-screen app settings."""
import base64, io, json, sys

css_path, js_path, out_path = sys.argv[1:4]
css = open(css_path, encoding="utf-8").read()
js = open(js_path, encoding="utf-8").read().replace("</script", "<\\/script")

ICON_SVG = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" rx="40" fill="#020617"/>'
            '<path d="M52 128V52h44a26 26 0 0 1 0 52H74" fill="none" stroke="#60a5fa" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>'
            '<circle cx="128" cy="128" r="10" fill="#fbbf24"/></svg>')

def png_icon(size=180):
    try:
        from PIL import Image, ImageDraw
    except Exception:
        return None
    s = 4
    im = Image.new("RGBA", (size * s, size * s), (2, 6, 23, 255))
    d = ImageDraw.Draw(im)
    k = size * s / 180
    w = int(16 * k)
    blue = (96, 165, 250, 255)
    d.line([(52 * k, 128 * k), (52 * k, 52 * k), (96 * k, 52 * k)], fill=blue, width=w, joint="curve")
    d.arc([(70 * k, 52 * k), (122 * k, 104 * k)], start=-90, end=90, fill=blue, width=w)
    d.line([(96 * k, 104 * k), (74 * k, 104 * k)], fill=blue, width=w)
    for (x, y) in [(52, 128), (52, 52), (74, 104)]:
        r = w / 2
        d.ellipse([(x * k - r, y * k - r), (x * k + r, y * k + r)], fill=blue)
    d.ellipse([(118 * k, 118 * k), (138 * k, 138 * k)], fill=(251, 191, 36, 255))
    im = im.resize((size, size), Image.LANCZOS)
    b = io.BytesIO()
    im.save(b, "PNG")
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()

svg_uri = "data:image/svg+xml;base64," + base64.b64encode(ICON_SVG.encode()).decode()
png_uri = png_icon() or svg_uri
manifest = {
    "name": "Protocol", "short_name": "Protocol", "start_url": ".", "display": "standalone",
    "background_color": "#020617", "theme_color": "#020617",
    "icons": [{"src": png_uri, "sizes": "180x180", "type": "image/png"}, {"src": svg_uri, "sizes": "any", "type": "image/svg+xml"}],
}
man_uri = "data:application/manifest+json;base64," + base64.b64encode(json.dumps(manifest).encode()).decode()

extra = """
html,body{background:#020617;margin:0;-webkit-text-size-adjust:100%;overscroll-behavior-y:none}
input,select,textarea{font-size:16px!important}
button{-webkit-tap-highlight-color:transparent}
.rig-pulse{animation:rigpulse 1.1s ease-in-out infinite}
@keyframes rigpulse{0%,100%{opacity:1}50%{opacity:.35}}
::-webkit-scrollbar{width:0;height:0}
"""

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Protocol">
<meta name="theme-color" content="#020617">
<title>Protocol</title>
<link rel="manifest" href="{man_uri}">
<link rel="icon" href="{svg_uri}">
<link rel="apple-touch-icon" href="{png_uri}">
<style>{css}{extra}</style>
</head>
<body>
<div id="root"><div id="boot" style="font-family:-apple-system,system-ui,sans-serif;color:#cbd5e1;padding:48px 24px;max-width:460px;margin:0 auto;line-height:1.5">
<div style="font-size:24px;font-weight:700;color:#f1f5f9">Protocol</div>
<p style="margin-top:12px">If you can read this, the app is not running. File previews (the Files app, the Claude app, iMessage) show the page but do not run apps.</p>
<p style="margin-top:12px;color:#94a3b8">Open it from its web link in Safari, then Share → Add to Home Screen.</p>
<pre id="boot-err" style="white-space:pre-wrap;color:#fb7185;font-size:12px;margin-top:16px"></pre>
</div></div>
<script>
window.addEventListener("error", function (e) {{
  var b = document.getElementById("boot-err");
  if (b) b.textContent += (e.message || "Error") + "\\n";
  else if (!document.getElementById("root").children.length) {{
    document.getElementById("root").innerHTML = '<pre style="color:#fb7185;padding:40px 20px;white-space:pre-wrap;font-size:12px">Protocol hit an error. Send a screenshot of this:\\n' + (e.message || "") + '</pre>';
  }}
}});
</script>
<script>{js}</script>
</body>
</html>
"""
open(out_path, "w", encoding="utf-8").write(html)
print("wrote", out_path, len(html) // 1024, "KB")
