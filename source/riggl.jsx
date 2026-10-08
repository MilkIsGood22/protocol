
/* ═══════════════ RIG RENDERER (WebGL) ═══════════════ */
/* Bodies are drawn as solid rounded bars with real depth, so a leg that goes behind
   a torso is actually hidden by it. One shared WebGL canvas renders every picture and
   the result is copied into whichever 2D canvas asked for it. */

const RIG_COL = {
  me: [[0.25, 0.55, 1.0], [0.10, 0.24, 0.62]],
  op: [[0.80, 0.84, 0.90], [0.43, 0.48, 0.57]],
  gray: [[0.30, 0.34, 0.41], [0.18, 0.21, 0.27]],
  green: [[0.18, 0.80, 0.56], [0.05, 0.42, 0.30]],
  dark: [[0.05, 0.07, 0.11], [0.03, 0.04, 0.07]],
  iron: [[0.36, 0.40, 0.47], [0.16, 0.18, 0.23]],
  steel: [[0.72, 0.76, 0.82], [0.36, 0.40, 0.47]],
  cloth: [[0.92, 0.94, 0.97], [0.55, 0.60, 0.68]],
};
const RIG_BG = [0.043, 0.071, 0.125];   // #0b1220

const anyPerp = y => V3.norm(V3.perp(Math.abs(y[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], y));

/* one drawable: a rounded bar from A to B. rad = [xA, zA, xB, zB] half-widths, cap = how far each end is rounded */
function bar(A, B, rA, rB, col, grp, extra) {
  const Y = V3.norm(V3.sub(B, A)), X = anyPerp(Y), Z = V3.cross(X, Y);
  return { A, B, XA: X, ZA: Z, XB: X, ZB: Z, Y, rad: [rA, rA, rB, rB], cap: [rA, rB], col, grp, ...(extra || {}) };
}
function blob(C, Y, Z, rx, ry, rz, col, grp, extra) {
  const X = V3.cross(Y, Z);
  return { A: C, B: C, XA: X, ZA: Z, XB: X, ZB: Z, Y, rad: [rx, rz, rx, rz], cap: [ry, ry], col, grp, ...(extra || {}) };
}

function figureParts(j, who, o) {
  o = o || {};
  const tint = g => (o.gray && o.gray.includes(g) ? "gray" : o.green && o.green.includes(g) ? "green" : who);
  const P = [];
  const T = tint("torso"), Hd = tint("head");
  /* torso: hips → waist → shoulders */
  P.push({ A: j.pelvis, B: j.waist, XA: j.hl, ZA: j.fH, XB: j.left, ZB: j.fLo, Y: j.uL, rad: [14.2, 9.6, 12.8, 8.8], cap: [8, 6], col: T, grp: "torso" });
  const top = V3.add(j.neck, V3.mul(j.uU, -4.5));
  P.push({ A: j.waist, B: top, XA: j.left, ZA: j.fUp, XB: j.left, ZB: j.fUp, Y: j.uU, rad: [12.8, 8.8, 17.2, 10.2], cap: [6, 6.5], col: T, grp: "torso" });
  /* neck and head */
  P.push(bar(V3.add(j.neck, V3.mul(j.uU, -2)), V3.add(j.head, V3.mul(j.headDir, -6)), 4.7, 4.3, Hd, "head"));
  P.push(blob(j.head, j.headDir, j.look, 8.7, 10.4, 9.5, Hd, "head"));
  const hx = V3.cross(j.headDir, j.look);
  P.push(blob(V3.add(j.head, V3.comb(j.look, 9.6, j.headDir, -1.2)), j.headDir, j.look, 1.9, 2.3, 2.3, Hd, "head", { detail: 1 }));
  [1, -1].forEach(sg => P.push(blob(V3.add(j.head, V3.comb(j.look, 8.75, j.headDir, 2.0, hx, sg * 3.4)), j.headDir, j.look, 1.35, 1.6, 0.9, "dark", "head", { detail: 1, flat: 1 })));
  ["L", "R"].forEach(S => {
    const a = tint("arm" + S), l = tint("leg" + S);
    const sh = j["sh" + S], el = j["el" + S], ha = j["ha" + S], hi = j["hi" + S], kn = j["kn" + S], fo = j["fo" + S], to = j["to" + S];
    P.push(bar(sh, el, 5.4, 4.2, a, "arm" + S));
    P.push(bar(el, ha, 4.1, 3.2, a, "arm" + S));
    const fd = V3.norm(V3.sub(ha, el));
    P.push(blob(V3.add(ha, V3.mul(fd, 2.6)), fd, anyPerp(fd), 3.9, 5.0, 3.0, a, "arm" + S));
    P.push(bar(hi, kn, 8.1, 5.7, l, "leg" + S));
    P.push(bar(kn, fo, 5.5, 3.8, l, "leg" + S));
    const td = j["toeDir" + S], sd = V3.norm(V3.sub(fo, kn));
    let fz = V3.perp(V3.mul(sd, -1), td);
    fz = V3.len(fz) < 0.1 ? anyPerp(td) : V3.norm(fz);
    const fx = V3.cross(td, fz);
    P.push({ A: V3.add(fo, V3.mul(td, -1.5)), B: V3.add(fo, V3.mul(td, BODY.foot - 3)), XA: fx, ZA: fz, XB: fx, ZB: fz, Y: td, rad: [3.9, 3.5, 3.9, 2.5], cap: [3.4, 3], col: l, grp: "leg" + S });
    if (o.gi) {
      const c0 = V3.lerp(el, ha, 0.70), c1 = V3.lerp(el, ha, 0.88);
      P.push(bar(c0, c1, 4.5, 4.1, "cloth", "arm" + S, { detail: 1 }));
    }
  });
  if (o.gi) {
    const n = j.neck, f = j.fUp, l = j.left, u = j.uU;
    const btm = V3.add(j.waist, V3.comb(j.fLo, 9.3, j.uL, -2));
    [1, -1].forEach(sg => {
      const a = V3.add(n, V3.comb(l, sg * 6.5, f, 7.2, u, -4)), m = V3.add(n, V3.comb(l, sg * 3.5, f, 10.4, u, -15));
      P.push(bar(a, m, 1.5, 1.5, "cloth", "torso", { detail: 1 }));
      P.push(bar(m, V3.add(btm, V3.mul(l, -sg * 3)), 1.5, 1.5, "cloth", "torso", { detail: 1 }));
    });
  }
  return P;
}

function propParts(props, j) {
  const P = [];
  (props || []).forEach(pr => {
    if (pr.t === "barbell" && j) {
      const c = V3.mid(j.haL, j.haR), d = V3.norm(V3.sub(j.haL, j.haR)), half = pr.half || 62, pl = pr.plate == null ? 15 : pr.plate;
      const a = V3.add(c, V3.mul(d, half)), b = V3.add(c, V3.mul(d, -half));
      P.push(bar(b, a, 1.5, 1.5, "steel", "prop"));
      if (pl > 0) [1, -1].forEach(sg => {
        const p0 = V3.add(c, V3.mul(d, sg * (half - 9))), p1 = V3.add(c, V3.mul(d, sg * (half - 4)));
        const X = anyPerp(d), Z = V3.cross(X, d);
        P.push({ A: p0, B: p1, XA: X, ZA: Z, XB: X, ZB: Z, Y: V3.mul(d, sg), rad: [pl, pl, pl, pl], cap: [1.4, 1.4], col: "iron", grp: "prop" });
      });
    }
    if (pr.t === "plate" && j) {
      const c = V3.add(j[pr.j || "haR"], pr.o || [0, -13, 0]), n = V3.norm(pr.n || [0, 0, 1]), r = pr.r || 13;
      const X = anyPerp(n), Z = V3.cross(X, n);
      P.push({ A: V3.add(c, V3.mul(n, -1.6)), B: V3.add(c, V3.mul(n, 1.6)), XA: X, ZA: Z, XB: X, ZB: Z, Y: n, rad: [r, r, r, r], cap: [1.3, 1.3], col: "iron", grp: "prop" });
    }
    if (pr.t === "bar") P.push(bar(pr.a, pr.b, pr.r || 1.8, pr.r || 1.8, pr.col || "steel", "prop"));
    if (pr.t === "wheel" && j) {
      const c = V3.mid(j.haL, j.haR), d = V3.norm(V3.sub(j.haL, j.haR));
      P.push(bar(V3.add(c, V3.mul(d, -17)), V3.add(c, V3.mul(d, 17)), 1.5, 1.5, "steel", "prop"));
      const X = anyPerp(d), Z = V3.cross(X, d), r = Math.max(6, c[1] - 0.5);
      P.push({ A: V3.add(c, V3.mul(d, -2)), B: V3.add(c, V3.mul(d, 2)), XA: X, ZA: Z, XB: X, ZB: Z, Y: d, rad: [r, r, r, r], cap: [1.5, 1.5], col: "iron", grp: "prop" });
    }
  });
  return P;
}

const RigGL = {
  gl: null, canvas: null, failed: false,
  init() {
    if (this.gl || this.failed) return !!this.gl;
    try {
      if (typeof document === "undefined") { this.failed = true; return false; }
      const c = document.createElement("canvas");
      const gl = c.getContext && (c.getContext("webgl", { antialias: true, stencil: true, alpha: false, preserveDrawingBuffer: true })
        || c.getContext("experimental-webgl", { antialias: true, stencil: true, alpha: false, preserveDrawingBuffer: true }));
      if (!gl) { this.failed = true; return false; }
      c.addEventListener("webglcontextlost", e => { e.preventDefault(); this.gl = null; });
      this.canvas = c; this.gl = gl;
      this.build();
      return true;
    } catch (e) { this.failed = true; this.gl = null; this.err = String(e); if (typeof console !== "undefined") console.error("RigGL: " + this.err); return false; }
  },
  sh(type, src) {
    const gl = this.gl, s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  },
  prog(vs, fs, attrs, unis) {
    const gl = this.gl, p = gl.createProgram();
    gl.attachShader(p, this.sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, this.sh(gl.FRAGMENT_SHADER, fs));
    attrs.forEach((a, i) => gl.bindAttribLocation(p, i, a));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    unis.forEach(n => { u[n] = gl.getUniformLocation(p, n); });
    return { p, u };
  },
  build() {
    const gl = this.gl;
    /* mesh: a sphere cut at the equator; each half is glued to one end of the bar */
    const NL = 7, NS = 20, v = [], idx = [];
    const rows = 2 * NL + 2;
    for (let r = 0; r < rows; r++) {
      const top = r <= NL;
      const phi = top ? (r / NL) * Math.PI / 2 : Math.PI / 2 + ((r - NL - 1) / NL) * Math.PI / 2;
      for (let c = 0; c <= NS; c++) {
        const th = (c / NS) * Math.PI * 2;
        v.push(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th), top ? 1 : 0);
      }
    }
    for (let r = 0; r < rows - 1; r++) for (let c = 0; c < NS; c++) {
      const a = r * (NS + 1) + c, b = a + NS + 1, d = a + 1, e = b + 1;
      idx.push(a, d, b, b, d, e);
    }
    this.vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
    this.ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    this.nIdx = idx.length;
    this.qb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.qb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const CAM = "uniform vec3 uCamR,uCamU,uCamD,uCamC,uScale;";
    this.body = this.prog(`
      attribute vec4 aV; ${CAM}
      uniform vec3 uA,uB,uXA,uZA,uXB,uZB,uY,uLight; uniform vec4 uRad; uniform vec2 uCap; uniform float uGrow,uShadow;
      varying vec3 vN; varying float vD;
      void main(){
        float e=aV.w; vec3 n0=aV.xyz;
        vec2 r=mix(uRad.xy,uRad.zw,e)+uGrow; float cap=mix(uCap.x,uCap.y,e)+uGrow;
        vec3 X=mix(uXA,uXB,e), Z=mix(uZA,uZB,e);
        vec3 p=mix(uA,uB,e)+X*n0.x*r.x+Z*n0.z*r.y+uY*n0.y*cap;
        vN=normalize(X*n0.x/r.x+Z*n0.z/r.y+uY*n0.y/cap);
        if(uShadow>0.5){ p.xz-=uLight.xz/uLight.y*p.y; p.y=0.0; }
        vec3 q=p-uCamC; vD=dot(q,uCamD);
        gl_Position=vec4(dot(q,uCamR)*uScale.x,dot(q,uCamU)*uScale.y,-vD*uScale.z,1.0);
      }`, `
      precision highp float;
      uniform vec3 uCol,uShade,uLight,uCamD; uniform float uFlat,uAlpha,uDim,uGlow,uHalf;
      varying vec3 vN; varying float vD;
      void main(){
        if(uFlat>0.5){ gl_FragColor=vec4(uCol,uAlpha); return; }
        vec3 n=normalize(vN);
        float d=dot(n,uLight);
        vec3 c=mix(uShade,uCol,smoothstep(-0.25,0.45,d));
        c+=smoothstep(0.86,0.97,dot(n,normalize(uLight+uCamD)))*0.09;
        float rim=pow(1.0-max(dot(n,uCamD),0.0),2.2);
        c=mix(c,uShade*0.7,rim*0.45);
        float far=clamp((uHalf-vD)/(2.0*uHalf),0.0,1.0);
        c*=mix(1.0,0.72,far);
        c=c*uDim+uGlow*uCol;
        gl_FragColor=vec4(c,uAlpha);
      }`, ["aV"], ["uCamR", "uCamU", "uCamD", "uCamC", "uScale", "uA", "uB", "uXA", "uZA", "uXB", "uZB", "uY", "uLight", "uRad", "uCap", "uGrow", "uShadow", "uCol", "uShade", "uFlat", "uAlpha", "uDim", "uGlow", "uHalf"]);
    this.mat = this.prog(`
      attribute vec2 aP; ${CAM} uniform vec3 uFocus; uniform float uSize; varying vec2 vW;
      void main(){
        vec3 p=vec3(uFocus.x+aP.x*uSize,0.0,uFocus.z+aP.y*uSize); vW=p.xz;
        vec3 q=p-uCamC;
        gl_Position=vec4(dot(q,uCamR)*uScale.x,dot(q,uCamU)*uScale.y,-dot(q,uCamD)*uScale.z,1.0);
      }`, `
      precision highp float;
      uniform vec3 uFocus,uBg; uniform float uPx,uFade; varying vec2 vW;
      void main(){
        vec2 g=abs(fract(vW/50.0-0.5)-0.5)*50.0;
        float w=max(0.35,0.9/uPx);
        float line=1.0-smoothstep(w,w*2.2,min(g.x,g.y));
        float r=length(vW-uFocus.xz)/uFade;
        float f=1.0-smoothstep(0.55,1.0,r);
        vec3 c=mix(vec3(0.075,0.115,0.195),vec3(0.14,0.20,0.31),line*0.8);
        gl_FragColor=vec4(mix(uBg,c,f),1.0);
      }`, ["aP"], ["uCamR", "uCamU", "uCamD", "uCamC", "uScale", "uFocus", "uSize", "uBg", "uPx", "uFade"]);
  },
  cam(pr, cam, mirror) {
    const gl = this.gl, u = pr.u, ax = cam.ax, dm = (cam.d0 + cam.d1) / 2;
    const C = V3.comb(ax.R, cam.cx, ax.U, cam.cy, ax.D, dm);
    gl.uniform3fv(u.uCamR, ax.R); gl.uniform3fv(u.uCamU, ax.U); gl.uniform3fv(u.uCamD, ax.D); gl.uniform3fv(u.uCamC, C);
    gl.uniform3f(u.uScale, (mirror ? -1 : 1) * 2 * cam.s / cam.W, 2 * cam.s / cam.H, 2 / (cam.d1 - cam.d0 + 120));
  },
  part(p, grow) {
    const gl = this.gl, u = this.body.u;
    gl.uniform3fv(u.uA, p.A); gl.uniform3fv(u.uB, p.B); gl.uniform3fv(u.uXA, p.XA); gl.uniform3fv(u.uZA, p.ZA);
    gl.uniform3fv(u.uXB, p.XB); gl.uniform3fv(u.uZB, p.ZB); gl.uniform3fv(u.uY, p.Y);
    gl.uniform4fv(u.uRad, p.rad); gl.uniform2fv(u.uCap, p.cap); gl.uniform1f(u.uGrow, grow || 0);
    gl.drawElements(gl.TRIANGLES, this.nIdx, gl.UNSIGNED_SHORT, 0);
  },
  /* scene: { W, H, dpr, cam, mirror, mat, figs: [{ parts, hot, dim, ghost }], light } */
  render(target, sc) {
    if (!this.init()) return false;
    const gl = this.gl, c = this.canvas;
    const pw = Math.max(2, Math.round(sc.W * sc.dpr)), ph = Math.max(2, Math.round(sc.H * sc.dpr));
    if (c.width !== pw || c.height !== ph) { c.width = pw; c.height = ph; }
    gl.viewport(0, 0, pw, ph);
    const bg = sc.bg || RIG_BG;
    gl.clearColor(bg[0], bg[1], bg[2], 1); gl.clearStencil(0);
    gl.depthMask(true); gl.colorMask(true, true, true, true); gl.stencilMask(0xff);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.BLEND); gl.disable(gl.STENCIL_TEST); gl.disable(gl.CULL_FACE);
    const L = V3.norm(sc.light || [0.28, 1, 0.42]);
    const cam = sc.cam, half = (cam.d1 - cam.d0) / 2 + 1;
    const solid = sc.figs.filter(f => !f.ghost), ghosts = sc.figs.filter(f => f.ghost);
    /* focus of the mat = middle of everything that is drawn */
    let fx = 0, fz = 0, n = 0;
    solid.forEach(f => f.parts.forEach(p => { fx += p.A[0] + p.B[0]; fz += p.A[2] + p.B[2]; n += 2; }));
    const focus = [n ? fx / n : 0, 0, n ? fz / n : 0];
    if (sc.mat !== false) {
      gl.useProgram(this.mat.p); this.cam(this.mat, cam, sc.mirror);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.qb); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.uniform3fv(this.mat.u.uFocus, focus); gl.uniform1f(this.mat.u.uSize, 900); gl.uniform3fv(this.mat.u.uBg, bg);
      gl.uniform1f(this.mat.u.uPx, cam.s * sc.dpr); gl.uniform1f(this.mat.u.uFade, sc.fade || 230);
      gl.depthMask(false); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); gl.depthMask(true);
    }
    gl.useProgram(this.body.p); this.cam(this.body, cam, sc.mirror);
    const u = this.body.u;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
    gl.uniform3fv(u.uLight, L); gl.uniform3fv(u.uCamD, cam.ax.D); gl.uniform1f(u.uHalf, half);
    /* shadows on the mat: each pixel darkened once */
    if (sc.mat !== false && sc.shadow !== false) {
      gl.enable(gl.STENCIL_TEST); gl.stencilFunc(gl.EQUAL, 0, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
      gl.uniform1f(u.uShadow, 1); gl.uniform1f(u.uFlat, 1); gl.uniform3f(u.uCol, 0, 0, 0); gl.uniform1f(u.uAlpha, 0.34);
      solid.forEach(f => f.parts.forEach(p => { if (!p.detail) this.part(p, 0); }));
      gl.disable(gl.STENCIL_TEST); gl.disable(gl.BLEND); gl.enable(gl.DEPTH_TEST);
    }
    gl.uniform1f(u.uShadow, 0);
    gl.enable(gl.CULL_FACE); gl.frontFace(sc.mirror ? gl.CW : gl.CCW);
    /* solid bodies */
    gl.cullFace(gl.BACK); gl.uniform1f(u.uAlpha, 1);
    solid.forEach(f => f.parts.forEach(p => {
      const col = RIG_COL[p.col] || RIG_COL.op, hot = f.hot && f.hot.includes(p.grp);
      gl.uniform3fv(u.uCol, col[0]); gl.uniform3fv(u.uShade, col[1]);
      gl.uniform1f(u.uFlat, p.flat ? 1 : 0);
      gl.uniform1f(u.uDim, f.dim && !hot ? 0.74 : 1); gl.uniform1f(u.uGlow, hot ? 0.16 : 0);
      this.part(p, 0);
    }));
    /* outlines: the back faces of a slightly fatter copy */
    gl.cullFace(gl.FRONT); gl.uniform1f(u.uFlat, 1); gl.uniform3f(u.uCol, 0.02, 0.03, 0.055);
    const grow = sc.outline == null ? Math.max(0.75, 1.5 / cam.s) : sc.outline;
    solid.forEach(f => f.parts.forEach(p => { if (!p.detail) this.part(p, grow); }));
    /* see-through figures: depth first, then one even layer of colour */
    if (ghosts.length) {
      gl.cullFace(gl.BACK);
      ghosts.forEach(f => {
        gl.colorMask(false, false, false, false);
        f.parts.forEach(p => { if (!p.detail) this.part(p, 0); });
        gl.colorMask(true, true, true, true); gl.depthFunc(gl.EQUAL); gl.depthMask(false);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.uniform1f(u.uFlat, 0); gl.uniform1f(u.uAlpha, f.alpha || 0.34); gl.uniform1f(u.uDim, 1); gl.uniform1f(u.uGlow, 0);
        f.parts.forEach(p => {
          if (p.detail) return;
          const col = RIG_COL[p.col] || RIG_COL.op;
          gl.uniform3fv(u.uCol, col[0]); gl.uniform3fv(u.uShade, col[1]);
          this.part(p, 0);
        });
        gl.disable(gl.BLEND); gl.depthFunc(gl.LEQUAL); gl.depthMask(true);
      });
    }
    gl.disable(gl.CULL_FACE);
    if (target) {
      if (target.width !== pw || target.height !== ph) { target.width = pw; target.height = ph; }
      const ctx = target.getContext("2d");
      if (ctx) ctx.drawImage(c, 0, 0);
    }
    return true;
  },
};
