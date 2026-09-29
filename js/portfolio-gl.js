/* =========================================================
   DesignNext Studio — Portfolio WebGL Thumbnails
   ---------------------------------------------------------
   ใช้ WebGL context เดียว (offscreen) วาด shader แล้ว copy ลง
   <canvas class="gl"> ของแต่ละการ์ด → ประหยัดทรัพยากร
   วาดเฉพาะการ์ดที่มองเห็นบนจอ และหยุดเมื่อสลับแท็บ
   สไตล์ shader แยกตามหมวดหมู่ผลงาน (data-style 0-5)
   ========================================================= */

const PortfolioGL = (() => {
  const STYLE = { 'Branding': 0, 'Graphic Design': 1, 'UI/UX': 2, 'Website': 3, 'Social Media': 4, 'Packaging': 5 };
  const W = 560, H = 420; // offscreen render size (4:3 same as .work-thumb)

  const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec3 u_c1; uniform vec3 u_c2;
uniform float u_style; uniform float u_seed; uniform float u_hover; uniform vec2 u_mouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + 1.), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0., a = .5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= .5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - .5 * u_res) / u_res.y;
  float t = u_time * (.18 + .32 * u_hover) + u_seed * 7.;
  vec2 m = (u_mouse - .5) * vec2(u_res.x / u_res.y, 1.);
  vec3 base = vec3(.043, .043, .06);
  vec3 col = base;
  int s = int(u_style + .5);

  if (s == 0) {            // Branding — liquid marble (domain warping)
    vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 3.1));
    vec2 r = vec2(fbm(p * 1.4 + 2. * q + vec2(1.7, 9.2) + t * .6), fbm(p * 1.4 + 2. * q + vec2(8.3, 2.8) - t * .5));
    float f = fbm(p * 1.4 + 2.4 * r + m * .5 * u_hover);
    col = mix(base, u_c1, smoothstep(.15, .85, f));
    col = mix(col, u_c2, smoothstep(.5, 1.1, length(r)));
    col += .35 * pow(f, 4.) + .08;
  } else if (s == 1) {     // Graphic Design — flowing ribbons
    col = mix(base, mix(u_c1, u_c2, uv.x) * .45, .6 + .4 * fbm(p * 2. + t));
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float y = p.y + .42 - fi * .17 + .14 * sin(p.x * 2.6 + t * 2. + fi * 1.3) + .1 * fbm(vec2(p.x * 2. + t, fi));
      float band = smoothstep(.035, .0, abs(y)) + .35 * exp(-abs(y) * 14.);
      col += band * mix(u_c1, u_c2, fract(fi * .37 + .5 * sin(t + p.x))) * (1. - fi * .09);
    }
  } else if (s == 2) {     // UI/UX — soft aurora
    col = base + .22 * u_c1 * smoothstep(.9, -.6, p.y);
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float y = p.y - (.14 * fi - .12) - .3 * fbm(vec2(p.x * 1.3 + t * .6 + fi * 3.1, t * .25 + fi));
      float a = exp(-abs(y) * 7.) * (.55 + .45 * sin(p.x * 3.5 + t * 1.3 + fi * 2.));
      col += a * mix(u_c1, u_c2, .5 + .5 * sin(p.x * 1.7 + t + fi));
    }
    col += .05 * fbm(p * 6. + t);
  } else if (s == 3) {     // Website — synthwave grid + sun
    float horizon = .06;
    col = mix(base, u_c1 * .55, smoothstep(-.1, .6, p.y));
    vec2 sp = p - vec2(m.x * .15 * u_hover, .26);
    float sun = smoothstep(.27, .25, length(sp));
    float stripes = step(.5, fract((p.y - t * .1) * 18.)) + step(.3, p.y);
    col = mix(col, mix(u_c2, vec3(1., .95, .8), smoothstep(0., .3, p.y)), sun * min(stripes, 1.));
    col += u_c2 * .25 * exp(-length(sp) * 3.5);
    if (p.y < horizon) {
      float d = horizon - p.y;
      float z = 1. / d;
      vec2 gp = vec2(p.x * z * .6, z * .35 + t * 2.2);
      vec2 f = abs(fract(gp) - .5);
      float line = smoothstep(.44, .5, max(f.x, f.y));
      col = mix(base, u_c1 * .18, .6) + line * mix(u_c1, u_c2, .5) * smoothstep(.0, .45, d) * 1.4;
      col += u_c2 * .35 * exp(-d * 18.);
    }
  } else if (s == 4) {     // Social Media — floating bokeh bubbles
    col = mix(base, u_c1 * .3, uv.y) + .06;
    float ar = u_res.x / u_res.y;
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      float h1 = hash(vec2(fi, u_seed)), h2 = hash(vec2(u_seed + 3., fi)), h3 = hash(vec2(fi * 1.7, fi + u_seed));
      vec2 c = vec2((h1 - .5) * ar + .08 * sin(t * 1.5 + fi), mod(h2 * 1.6 + t * (.12 + .18 * h3), 1.6) - .8);
      float r = .04 + .11 * h3;
      float d = length(p - c);
      vec3 bc = mix(u_c1, u_c2, h2);
      col += bc * (smoothstep(r, r - .015, d) * .28 + smoothstep(r, r - .006, d) * smoothstep(r - .03, r - .006, d) * .5);
      col += bc * .06 * exp(-d * 6.);
    }
  } else {                 // Packaging — iridescent metallic swirl
    float an = atan(p.y, p.x); float r = length(p);
    float f = fbm(vec2(an * .6 + t * .4, r * 1.4 - t * .5) + m * .5 * u_hover);
    float sheen = smoothstep(.3, .8, f);
    vec3 iri = .5 + .5 * cos(6.2832 * (f * .6 + r * .3 + vec3(0., .33, .67)) + t * .5);
    col = mix(base, mix(u_c1, u_c2, sheen), .25 + .75 * sheen);
    col = mix(col, iri * mix(u_c1, u_c2, .5) * 1.4, .15);
    col += .16 * pow(max(0., sin(an * 2. + f * 3. - t)), 10.) * (1. - r);
  }

  // Hover spotlight, vignette, film grain
  col += u_hover * .28 * mix(u_c1, u_c2, .5) * exp(-length(p - m) * 3.2);
  col *= 1. - .45 * pow(length(uv - .5) * 1.25, 2.);
  col += (hash(gl_FragCoord.xy + fract(u_time) * 100.) - .5) * .035;
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`;

  const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

  let gl = null, glCanvas = null, U = {}, raf = 0, io = null;
  const items = [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0 = performance.now();

  const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16) / 255); };

  function init() {
    if (gl !== null) return !!gl;
    glCanvas = document.createElement('canvas');
    glCanvas.width = W; glCanvas.height = H;
    gl = glCanvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false }) || false;
    if (!gl) return false;
    const sh = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    try {
      const prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog); gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a');
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['u_res', 'u_time', 'u_c1', 'u_c2', 'u_style', 'u_seed', 'u_hover', 'u_mouse'].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
      gl.viewport(0, 0, W, H);
      gl.uniform2f(U.u_res, W, H);
    } catch (e) { console.warn('PortfolioGL shader error', e); gl = false; return false; }
    io = new IntersectionObserver((ens) => ens.forEach((en) => {
      const it = items.find((x) => x.canvas === en.target); if (it) it.visible = en.isIntersecting;
    }), { rootMargin: '100px' });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) loop(); });
    return true;
  }

  function size(it) {
    const r = it.canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(2, Math.min(720, Math.round(r.width * dpr)));
    const h = Math.max(2, Math.round(w * H / W));
    if (it.canvas.width !== w || it.canvas.height !== h) { it.canvas.width = w; it.canvas.height = h; }
  }

  function attach(canvas) {
    if (canvas.dataset.glReady || !init()) return;
    canvas.dataset.glReady = 1;
    const it = {
      canvas, ctx: canvas.getContext('2d'), visible: false, hover: 0, hoverTarget: 0, mouse: [0.5, 0.5],
      c1: hex(canvas.dataset.c1), c2: hex(canvas.dataset.c2),
      style: STYLE[canvas.dataset.style] ?? 0, seed: Number(canvas.dataset.seed || 0) * 1.37 + 0.5
    };
    items.push(it);
    io.observe(canvas);
    // Hover interaction on the whole card (also drives mockup parallax via CSS vars)
    const host = canvas.closest('.work-card') || canvas.parentElement;
    host.addEventListener('mouseenter', () => { it.hoverTarget = 1; });
    host.addEventListener('mouseleave', () => { it.hoverTarget = 0; host.style.setProperty('--px', 0); host.style.setProperty('--py', 0); });
    host.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      it.mouse = [x, 1 - y];
      host.style.setProperty('--px', (x - 0.5).toFixed(3));
      host.style.setProperty('--py', (y - 0.5).toFixed(3));
    });
    canvas.classList.add('on');
    loop();
  }

  function draw(it, time) {
    size(it);
    it.hover += (it.hoverTarget - it.hover) * 0.08;
    gl.uniform1f(U.u_time, time);
    gl.uniform3fv(U.u_c1, it.c1); gl.uniform3fv(U.u_c2, it.c2);
    gl.uniform1f(U.u_style, it.style); gl.uniform1f(U.u_seed, it.seed);
    gl.uniform1f(U.u_hover, it.hover); gl.uniform2f(U.u_mouse, it.mouse[0], it.mouse[1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    it.ctx.drawImage(glCanvas, 0, 0, it.canvas.width, it.canvas.height);
  }

  function frame() {
    raf = 0;
    const time = reduce ? 3 : (performance.now() - t0) / 1000;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      if (!it.canvas.isConnected) { io.unobserve(it.canvas); items.splice(i, 1); continue; }
      if (it.visible || !it.drawn) { draw(it, time); it.drawn = true; }
    }
    if (items.length && !document.hidden && !reduce) loop();
  }
  function loop() { if (!raf) raf = requestAnimationFrame(frame); }

  /* Attach every un-initialised canvas.gl inside scope */
  function scan(scope = document) { scope.querySelectorAll('canvas.gl:not([data-gl-ready])').forEach(attach); }

  return { scan, attach };
})();
