// Animated particle brain: scattered "thoughts" converge into a mind, then breathe,
// pulse with synapse waves, react to the cursor and shift colour as the page scrolls.
import * as THREE from './three.module.min.js';

const canvas = document.getElementById('mind');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmall = () => innerWidth < 820;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  document.documentElement.classList.add('no-webgl');
}

if (renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 6;

  const COUNT = isSmall() ? 9000 : 18000;

  const randDir = () => {
    const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    return [s * Math.cos(a), u, s * Math.sin(a)];
  };

  // Procedural brain: two folded hemispheres, cerebellum and stem
  function brainPoint() {
    const r = Math.random();
    let x, y, z;
    if (r < 0.86) {
      const side = Math.random() < 0.5 ? -1 : 1;
      let u, fold;
      // favour the ridges of the folds so the gyri read as texture
      do {
        u = randDir();
        fold = Math.sin(u[0] * 9 + Math.sin(u[2] * 6) * 1.5) * Math.sin(u[1] * 10 + u[2] * 7) + 0.35 * Math.sin(u[2] * 19 + u[1] * 13);
      } while (Math.random() > 0.2 + 0.8 * Math.max(0, fold * 0.5 + 0.4));
      if (u[0] * side < 0) u[0] *= 0.4;                       // flat inner face along the fissure
      x = u[0] * 0.62; y = u[1] * 0.78; z = u[2] * 1.12;
      if (y < -0.2) y = -0.2 + (y + 0.2) * 0.55;              // flatter underside
      if (z > 0.2 && y < 0) y *= 0.85;                         // frontal lobe tapers
      if (z < 0.4 && z > -0.5 && y < -0.05) { y -= 0.12; x *= 1.06; } // temporal lobe
      const k = (1 + 0.06 * fold) * (Math.random() < 0.85 ? 1 : 0.72 + Math.random() * 0.25);
      x = x * k + side * 0.3; y = y * k + 0.12; z = z * k;
    } else if (r < 0.96) {
      const u = randDir();
      const f = 1 + 0.06 * Math.sin(u[1] * 34);
      x = u[0] * 0.5 * f; y = u[1] * 0.26 * f - 0.52; z = u[2] * 0.34 * f - 0.74;
    } else {
      const t = Math.random(), a = Math.random() * Math.PI * 2, rr = 0.13 * Math.sqrt(Math.random());
      x = Math.cos(a) * rr; y = -0.42 - t * 0.78; z = -0.3 + Math.sin(a) * rr - t * 0.18;
    }
    return [x, y, z];
  }

  const pos = new Float32Array(COUNT * 3);
  const chaos = new Float32Array(COUNT * 3);
  const rand = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const b = brainPoint();
    pos.set(b, i * 3);
    const d = randDir(), rr = 2.2 + Math.random() * 3.5;
    chaos.set([d[0] * rr * 1.4, d[1] * rr, d[2] * rr], i * 3);
    rand[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aChaos', new THREE.BufferAttribute(chaos, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));

  const uniforms = {
    uTime: { value: 0 },
    uMorph: { value: reduceMotion ? 1 : 0 },
    uSize: { value: isSmall() ? 13 : 12.5 },
    uPixel: { value: Math.min(devicePixelRatio, 2) },
    uMouse: { value: new THREE.Vector2(9, 9) },
    uAspect: { value: innerWidth / innerHeight },
    uOpacity: { value: 1 },
    uShift: { value: 0 },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      uniform float uTime, uMorph, uSize, uPixel, uAspect;
      uniform vec2 uMouse;
      attribute vec3 aChaos;
      attribute float aRand;
      varying float vPulse, vMix, vAlpha;
      void main() {
        float m = clamp(uMorph * 1.5 - aRand * 0.5, 0.0, 1.0);
        m = m * m * (3.0 - 2.0 * m);
        vec3 p = mix(aChaos, position, m);
        p += 0.018 * vec3(sin(uTime * 0.8 + aRand * 40.0), cos(uTime * 0.7 + aRand * 30.0), sin(uTime * 0.6 + aRand * 20.0));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        // the cursor gently parts the thoughts
        vec2 ndc = gl_Position.xy / gl_Position.w;
        vec2 d = ndc - uMouse; d.x *= uAspect;
        float f = smoothstep(0.32, 0.0, length(d));
        vec2 push = normalize(d + 1e-4); push.x /= uAspect;
        gl_Position.xy += push * f * 0.09 * gl_Position.w;

        // synapse waves travelling through the mind
        float wave = sin(position.z * 2.6 + position.y * 1.7 - uTime * 1.5 + aRand * 1.4);
        vPulse = smoothstep(0.94, 1.0, wave) * m + f * 0.35;
        vMix = clamp(position.y * 0.45 - position.z * 0.3 + 0.5, 0.0, 1.0);
        vAlpha = 0.25 + 0.75 * m;
        gl_PointSize = uSize * uPixel * (1.0 + vPulse * 1.4) * (0.55 + aRand * 0.9) / -mv.z;
      }`,
    fragmentShader: /* glsl */`
      uniform float uOpacity, uShift;
      varying float vPulse, vMix, vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d);
        vec3 cyan = vec3(0.50, 0.88, 1.0), violet = vec3(0.63, 0.55, 1.0), rose = vec3(1.0, 0.62, 0.78), peach = vec3(1.0, 0.80, 0.66);
        vec3 c1 = mix(cyan, violet, uShift), c2 = mix(violet, rose, uShift), c3 = mix(rose, peach, uShift);
        vec3 col = vMix < 0.5 ? mix(c1, c2, vMix * 2.0) : mix(c2, c3, (vMix - 0.5) * 2.0);
        col = mix(col, vec3(1.0), vPulse * 0.75);
        gl_FragColor = vec4(col, a * vAlpha * uOpacity * (0.8 + vPulse));
      }`,
  });

  const brain = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(brain);
  scene.add(group);

  // Orbits: two tilted rings of light circling the mind
  const ringUniforms = { uTime: uniforms.uTime, uPixel: uniforms.uPixel, uOpacity: uniforms.uOpacity, uMorph: uniforms.uMorph };
  const makeRing = (radius, n, tiltX, tiltZ, speed, hue) => {
    const p = new Float32Array(n * 3), a = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2, j = (Math.random() - 0.5) * 0.05;
      p.set([Math.cos(ang) * (radius + j), (Math.random() - 0.5) * 0.02, Math.sin(ang) * (radius + j)], i * 3);
      a[i] = ang;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('aAng', new THREE.BufferAttribute(a, 1));
    const m = new THREE.ShaderMaterial({
      uniforms: { ...ringUniforms, uSpeed: { value: speed }, uHue: { value: new THREE.Color(hue) } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime, uPixel, uSpeed, uMorph;
        attribute float aAng;
        varying float vB;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          vB = pow(0.5 + 0.5 * sin(aAng * 2.0 - uTime * uSpeed), 6.0) * smoothstep(0.4, 1.0, uMorph);
          gl_PointSize = (2.0 + vB * 5.0) * uPixel * 3.0 / -mv.z;
        }`,
      fragmentShader: `
        uniform vec3 uHue; uniform float uOpacity;
        varying float vB;
        void main() {
          float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
          gl_FragColor = vec4(mix(uHue, vec3(1.0), vB * 0.6), smoothstep(0.5, 0.0, d) * (0.08 + vB * 0.9) * uOpacity);
        }`,
    });
    const ring = new THREE.Points(g, m);
    ring.rotation.set(tiltX, 0, tiltZ);
    return ring;
  };
  const rings = [makeRing(1.75, 1400, 1.25, 0.35, 1.1, 0xa18cff), makeRing(2.05, 1600, 1.45, -0.5, -0.8, 0x7fe0ff)];
  rings.forEach(r => group.add(r));

  // Deep space: stars at many depths, twinkling
  const STARS = isSmall() ? 2500 : 5000;
  const sp = new Float32Array(STARS * 3), sr = new Float32Array(STARS);
  for (let i = 0; i < STARS; i++) {
    sp.set([(Math.random() - 0.5) * 90, (Math.random() - 0.5) * 70, -Math.random() * 60 + 2], i * 3);
    sr[i] = Math.random();
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sg.setAttribute('aRand', new THREE.BufferAttribute(sr, 1));
  const stars = new THREE.Points(sg, new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uPixel: uniforms.uPixel },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime, uPixel;
      attribute float aRand;
      varying float vA; varying float vT;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        vA = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aRand * 2.0) + aRand * 60.0));
        vT = aRand;
        gl_PointSize = (aRand > 0.97 ? 3.2 : 1.4 + aRand) * uPixel * 14.0 / -mv.z;
      }`,
    fragmentShader: `
      varying float vA; varying float vT;
      void main() {
        float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
        vec3 c = mix(vec3(0.75, 0.82, 1.0), vec3(1.0, 0.85, 0.9), step(0.8, vT));
        gl_FragColor = vec4(c, smoothstep(0.5, 0.0, d) * vA);
      }`,
  }));
  scene.add(stars);

  // Nebula: slow-moving clouds of colour far behind everything
  const nebula = new THREE.Mesh(new THREE.PlaneGeometry(110, 70), new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uShift: uniforms.uShift },
    transparent: true, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform float uTime, uShift; varying vec2 vUv;
      float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * n(p); p *= 2.02; a *= 0.5; } return v; }
      void main() {
        vec2 p = vUv * vec2(3.2, 2.0);
        float t = uTime * 0.02;
        float q = fbm(p + vec2(t, -t * 0.6));
        float r = fbm(p * 1.4 + q * 1.8 + vec2(-t * 0.8, t));
        vec3 deep = vec3(0.10, 0.07, 0.30), violet = vec3(0.42, 0.22, 0.70), cyan = vec3(0.10, 0.45, 0.70), rose = vec3(0.75, 0.28, 0.50);
        vec3 col = mix(deep, violet, smoothstep(0.35, 0.8, r));
        col = mix(col, mix(cyan, rose, uShift), smoothstep(0.55, 0.95, q * r * 1.6));
        float mask = smoothstep(0.45, 0.9, r) * (1.0 - smoothstep(0.15, 0.7, abs(vUv.y - 0.5)));
        gl_FragColor = vec4(col, mask * 0.42);
      }`,
  }));
  nebula.position.z = -30;
  scene.add(nebula);

  // Layout: the mind is the centrepiece of the hero, fitted into the open
  // space between the menu and the headline so it never covers text
  const heroText = document.querySelector('.hero-bottom');
  let fitted = null;
  const fit = () => {
    const unitsTall = 2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * 6;
    const pxPerUnit = innerHeight / unitsTall;
    const top = document.documentElement.classList.contains('og-shot') ? 20 : 120;
    const bottom = heroText ? heroText.getBoundingClientRect().top + scrollY - 16 : innerHeight * 0.55;
    const bandPx = Math.max(160, bottom - top);
    const widthUnits = innerWidth / pxPerUnit;
    const s = Math.min(isSmall() ? 0.85 : 1.12, bandPx / pxPerUnit / 1.9, widthUnits * 0.75 / 2.3);
    const centerPx = (top + bottom) / 2;
    fitted = { x: isSmall() ? -0.06 : 0.2, y: (innerHeight / 2 - centerPx) / pxPerUnit + 0.12 * s, s };
  };
  const layout = () => { if (!fitted) fit(); return fitted; };
  addEventListener('resize', () => { fitted = null; });
  if (document.fonts) document.fonts.ready.then(() => { fitted = null; });

  const resize = () => {
    renderer.setPixelRatio(Math.min(devicePixelRatio, isSmall() ? 1.5 : 2)); // spare phone batteries
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    uniforms.uAspect.value = camera.aspect;
  };
  resize();
  addEventListener('resize', resize);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', e => {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ty = -(e.clientY / innerHeight) * 2 + 1;
  });
  document.addEventListener('pointerleave', () => { mouse.tx = 9; mouse.ty = 9; });

  const start = performance.now();
  let current = { ...layout(), spin: 0 };
  const lerp = (a, b, t) => a + (b - a) * t;

  function frame(now) {
    const t = (now - start) / 1000;
    uniforms.uTime.value = reduceMotion ? 0 : t;
    if (!reduceMotion) uniforms.uMorph.value = Math.min(1, Math.max(0, (t - 0.2) / 3.2));

    // scroll: the mind drifts to centre and becomes an ambient presence
    const hero = Math.min(1, scrollY / innerHeight);
    const page = Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    uniforms.uOpacity.value = 1 - 0.78 * hero;
    uniforms.uShift.value = page;

    const L = layout();
    const target = { x: lerp(L.x, 0, hero), y: lerp(L.y, 0, hero), s: lerp(L.s, isSmall() ? 1.0 : 1.5, hero) };
    current.x = lerp(current.x, target.x, 0.06);
    current.y = lerp(current.y, target.y, 0.06);
    current.s = lerp(current.s, target.s, 0.06);
    group.position.set(current.x, current.y, 0);
    group.scale.setScalar(current.s);

    if (mouse.tx < 5) { mouse.x = lerp(mouse.x, mouse.tx, 0.08); mouse.y = lerp(mouse.y, mouse.ty, 0.08); }
    uniforms.uMouse.value.set(mouse.tx < 5 ? mouse.x : 9, mouse.tx < 5 ? mouse.y : 9);

    // scrolling travels forward through space
    camera.position.z = 6 - page * 14;
    camera.position.y = -page * 2;
    camera.lookAt(0, camera.position.y, camera.position.z - 6);
    group.position.z = camera.position.z - 6;
    group.position.y += camera.position.y;
    stars.rotation.z = t * 0.004;
    rings[0].rotation.y = t * 0.15;
    rings[1].rotation.y = -t * 0.1;

    // sway around a three-quarter side view, where a brain reads clearly as a brain
    const sway = reduceMotion ? 0 : Math.sin(t * 0.18) * 0.55;
    brain.rotation.y = Math.PI / 2 - 0.45 + sway + scrollY * 0.0008;
    group.rotation.x = 0.18 + (mouse.tx < 5 ? mouse.y : 0) * -0.12;
    group.rotation.z = (mouse.tx < 5 ? mouse.x : 0) * -0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.documentElement.classList.add('mind-ready');
}
