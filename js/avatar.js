// 3D cartoon avatar of Ador for the homepage hero.
// Stylised (not a scan): brown skin, short swept black hair, beard, black jersey with a gold collar and "ARES" on the back.
// Drag to rotate, it idles, blinks and says "Never give up!" with a fist pump. Tap "Hear it" to have the browser speak it.
// If WebGL is missing, the photo that is already in the page simply stays.
import * as THREE from './vendor/three.module.min.js';
import { OrbitControls } from './vendor/OrbitControls.js';

const box = document.querySelector('[data-avatar3d]');
if (box) {
  try { start(box); } catch (e) { console.warn('3D avatar not available:', e); }
}

function start(box) {
  const test = document.createElement('canvas');
  if (!(test.getContext('webgl2') || test.getContext('webgl'))) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = box.querySelector('.av-stage');
  const bubble = box.querySelector('.av-bubble');
  const sayBtn = box.querySelector('[data-say]');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0.9, 2.2, 7.4);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.75, 0);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 4.5;
  controls.maxDistance = 10;
  controls.minPolarAngle = 0.35;
  controls.maxPolarAngle = 1.75;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 1.6;
  let resumeTimer;
  controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(resumeTimer); box.classList.add('touched'); });
  controls.addEventListener('end', () => { if (!reduce) resumeTimer = setTimeout(() => { controls.autoRotate = true; }, 5000); });

  // ---------- lights ----------
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a2a2a, 1.5));
  const fill = new THREE.DirectionalLight(0xffffff, 0.9); fill.position.set(-3, 2.5, 5); scene.add(fill);
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
  const rimGold = new THREE.DirectionalLight(0xf5a524, 1.6); rimGold.position.set(-3.5, 3, -4); scene.add(rimGold);
  const rimRed = new THREE.DirectionalLight(0xff3355, 1.1); rimRed.position.set(4, 2, -3); scene.add(rimRed);

  // ---------- materials ----------
  const mat = (color, rough = 0.7, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
  const SKIN = mat(0x9c6a48, 0.6);
  const SKIN_DARK = mat(0x86573a, 0.65);
  const HAIR = mat(0x141012, 0.55);
  const BEARD = mat(0x241a14, 0.95);
  const WHITE = mat(0xf4f1ec, 0.3);
  const PUPIL = mat(0x1b120d, 0.2);
  const MOUTH = mat(0x3a1414, 0.6);
  const GOLD = mat(0xf5b324, 0.45);
  const DENIM = mat(0x22314a, 0.85);
  const SHOE = mat(0xe9e9e9, 0.5);
  const SOLE = mat(0x2b2b2b, 0.8);

  // Jersey texture: black with gold diagonal stripes on the front, "ARES" on the back.
  const jc = document.createElement('canvas'); jc.width = 1024; jc.height = 512;
  const g = jc.getContext('2d');
  g.fillStyle = '#16161a'; g.fillRect(0, 0, 1024, 512);
  g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 2;
  for (let i = 0; i < 60; i++) { g.beginPath(); const x = Math.random() * 1024, y = Math.random() * 512; g.moveTo(x, y); g.lineTo(x + 30 - Math.random() * 60, y + 30 - Math.random() * 60); g.stroke(); }
  const stripe = (cx) => {
    g.save(); g.translate(cx, 300); g.rotate(-0.55);
    g.fillStyle = '#f5b324'; g.fillRect(-150, -14, 300, 12);
    g.fillStyle = '#c98a10'; g.fillRect(-120, 8, 240, 6);
    g.restore();
  };
  stripe(60); stripe(1024 + 60); stripe(-1024 + 60); // front sits at u = 0 / 1
  g.fillStyle = '#f5b324'; g.font = '800 120px Outfit, "Segoe UI", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('ARES', 512, 190);
  const jerseyTex = new THREE.CanvasTexture(jc);
  jerseyTex.colorSpace = THREE.SRGBColorSpace;
  jerseyTex.anisotropy = 4;
  const JERSEY = new THREE.MeshStandardMaterial({ map: jerseyTex, roughness: 0.75 });
  const JERSEY_PLAIN = mat(0x16161a, 0.75);

  const S = (r, w = 32, h = 24) => new THREE.SphereGeometry(r, w, h);
  const add = (parent, geo, material, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) => {
    const m = new THREE.Mesh(geo, material); m.position.set(x, y, z); m.scale.set(sx, sy, sz); parent.add(m); return m;
  };

  const me = new THREE.Group(); scene.add(me);
  const body = new THREE.Group(); me.add(body);

  // ---------- legs + shoes ----------
  for (const s of [-1, 1]) {
    add(body, new THREE.CylinderGeometry(0.17, 0.15, 0.82, 20), DENIM, s * 0.21, 0.55, 0);
    add(body, new THREE.BoxGeometry(0.3, 0.16, 0.48), SHOE, s * 0.22, 0.1, 0.07);
    add(body, new THREE.BoxGeometry(0.31, 0.05, 0.5), SOLE, s * 0.22, 0.02, 0.07);
  }
  add(body, new THREE.CylinderGeometry(0.42, 0.4, 0.28, 24), DENIM, 0, 1.0, 0); // hips

  // ---------- torso (jersey) ----------
  const torso = add(body, new THREE.CylinderGeometry(0.5, 0.43, 0.95, 40, 1, true), JERSEY, 0, 1.6, 0);
  add(body, S(0.5, 32, 16), JERSEY_PLAIN, 0, 2.07, 0, 1, 0.32, 0.86);       // shoulders top
  add(body, new THREE.CylinderGeometry(0.43, 0.43, 0.02, 32), JERSEY_PLAIN, 0, 1.13, 0);
  torso.scale.z = 0.86;
  const collar = add(body, new THREE.TorusGeometry(0.17, 0.035, 12, 32), GOLD, 0, 2.17, 0);
  collar.rotation.x = Math.PI / 2;
  add(body, new THREE.CylinderGeometry(0.14, 0.15, 0.22, 20), SKIN, 0, 2.24, 0); // neck

  // ---------- arms (shoulder pivots) ----------
  function arm(side) {
    const pivot = new THREE.Group(); pivot.position.set(side * 0.56, 1.98, 0); body.add(pivot);
    const sleeve = add(pivot, new THREE.CylinderGeometry(0.15, 0.14, 0.32, 20), JERSEY_PLAIN, 0, -0.14, 0);
    add(pivot, new THREE.TorusGeometry(0.14, 0.025, 8, 24), GOLD, 0, -0.3, 0).rotation.x = Math.PI / 2;
    add(pivot, new THREE.CylinderGeometry(0.11, 0.1, 0.55, 18), SKIN, 0, -0.55, 0);
    const hand = add(pivot, S(0.13), SKIN, 0, -0.86, 0.02, 1, 1.05, 0.95);
    pivot.rotation.z = side * 0.12;
    return { pivot, hand, sleeve };
  }
  const armL = arm(1);   // his left (viewer's right)
  const armR = arm(-1);  // his right: does the fist pump

  // ---------- head ----------
  const head = new THREE.Group(); head.position.set(0, 2.85, 0); body.add(head);
  add(head, S(0.62, 48, 36), SKIN, 0, 0, 0, 0.94, 1.02, 0.95);
  for (const s of [-1, 1]) add(head, S(0.12), SKIN_DARK, s * 0.58, -0.02, -0.02, 0.5, 1, 0.8); // ears
  add(head, S(0.085), SKIN_DARK, 0, -0.07, 0.6, 0.9, 1, 1);                // nose

  // eyes + blink
  const eyes = new THREE.Group(); eyes.position.set(0, 0.06, 0); head.add(eyes);
  for (const s of [-1, 1]) {
    add(eyes, S(0.085), WHITE, s * 0.2, 0, 0.5, 1, 0.85, 0.6);
    add(eyes, S(0.05), PUPIL, s * 0.2, 0, 0.55, 1, 1, 0.5);
    const brow = add(head, new THREE.BoxGeometry(0.2, 0.04, 0.05), HAIR, s * 0.2, 0.2, 0.53);
    brow.rotation.z = s * -0.12;
  }

  // mouth (opens while talking)
  const mouth = add(head, S(0.09), MOUTH, 0, -0.27, 0.565, 1.3, 0.25, 0.5);

  // beard, moustache and goatee
  // short full beard: a shell over the lower half of the face, from ear to ear
  const beardShell = add(head, new THREE.SphereGeometry(0.632, 48, 24, Math.PI * 0.08, Math.PI * 0.84, Math.PI * 0.66, Math.PI * 0.2), BEARD, 0, 0.02, 0.01, 0.95, 1.02, 0.97);
  beardShell.rotation.y = 0;
  add(head, S(0.14), BEARD, 0, -0.45, 0.4, 1.2, 0.6, 0.7);                 // chin
  add(head, new THREE.CapsuleGeometry(0.035, 0.2, 6, 12), BEARD, 0, -0.17, 0.58).rotation.z = Math.PI / 2; // moustache
  for (const s of [-1, 1]) add(head, S(0.08), BEARD, s * 0.48, -0.15, 0.22, 0.6, 1.3, 1);       // sideburns

  // hair: short cap + swept quiff
  const cap = add(head, new THREE.SphereGeometry(0.65, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.52), HAIR, 0, 0.02, -0.02, 0.96, 1.03, 0.99);
  [[-0.18, 0.5, 0.36, 0.3], [0.05, 0.56, 0.32, 0.34], [0.26, 0.52, 0.26, 0.28], [-0.36, 0.4, 0.3, 0.24]].forEach(([x, y, z, r]) => {
    const q = add(head, S(r, 24, 16), HAIR, x, y, z, 1.2, 0.55, 0.9); q.rotation.z = -0.35;
  });
  cap.rotation.x = -0.5;
  // back of the head: short hair down to the neck
  add(head, new THREE.SphereGeometry(0.648, 40, 20, Math.PI, Math.PI, Math.PI * 0.3, Math.PI * 0.42), HAIR, 0, 0, 0, 0.96, 1.02, 0.98);

  // soft round shadow under the feet
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const sg = sc.getContext('2d'); const grd = sg.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,.55)'); grd.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = grd; sg.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; me.add(shadow);

  // ---------- size ----------
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  // ---------- "Never give up!" ----------
  let talkStart = -10;
  function say(withVoice) {
    talkStart = performance.now() / 1000;
    bubble.classList.add('show');
    clearTimeout(say.t); say.t = setTimeout(() => bubble.classList.remove('show'), 2600);
    if (withVoice && 'speechSynthesis' in window) {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance('Never give up!');
        u.rate = 0.95; u.pitch = 0.9; u.lang = 'en-US';
        speechSynthesis.speak(u);
      } catch (e) { /* voice is optional */ }
    }
  }
  if (sayBtn) sayBtn.addEventListener('click', () => say(true));
  setTimeout(() => say(false), 1200);
  setInterval(() => { if (!document.hidden && visible) say(false); }, 8000);

  // ---------- animation loop (pauses when off-screen or tab hidden) ----------
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.05 }).observe(box);
  let nextBlink = 2;
  const clock = new THREE.Clock();
  box.classList.add('ready');

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    const now = performance.now() / 1000;
    const k = now - talkStart;               // seconds since "Never give up!" started
    const talking = k >= 0 && k < 1.6;

    if (!reduce) {
      body.position.y = Math.sin(t * 2) * 0.025;           // breathing
      head.rotation.y = Math.sin(t * 0.7) * 0.18;           // looking around
      head.rotation.x = Math.sin(t * 0.9) * 0.04;
      armL.pivot.rotation.x = Math.sin(t * 1.3) * 0.08;
    }
    // fist pump while talking
    const pump = talking ? Math.sin(Math.min(k / 0.35, 1) * Math.PI / 2) : Math.max(0, 1 - (k - 1.6) / 0.4) * (k > 1.6 && k < 2 ? 1 : 0);
    armR.pivot.rotation.x = -2.5 * pump + (reduce ? 0 : Math.sin(t * 1.3 + 1) * 0.08 * (1 - pump));
    armR.pivot.rotation.z = -0.12 - 0.35 * pump + (talking ? Math.sin(k * 14) * 0.06 : 0);
    armR.hand.scale.set(1.05, 1.05, 1.05);
    // mouth syllables: Ne-ver-give-up
    mouth.scale.y = talking ? 0.25 + Math.abs(Math.sin(k * 11)) * 0.9 : 0.25;
    // blink
    if (t > nextBlink) { eyes.scale.y = 0.1; if (t > nextBlink + 0.12) { eyes.scale.y = 1; nextBlink = t + 2.5 + Math.random() * 2.5; } }

    controls.update();
    renderer.render(scene, camera);
  }
  frame();
}
