// Full-body 3D figure of Ador for the homepage hero.
// The body is built from shapes in code; the face is Ador's approved animated portrait (images/ador-face.webp),
// wrapped around the front of the head with soft edges so it blends into the hair and skin.
// He wears the SGC KINGSMEN jersey (black, gold collar and cuffs, S and K logos, gold stripes, Bangladesh flag).
// Drag to rotate all the way round; it idles, and says "Never give up!" with a fist pump. "Hear it" speaks the line.
// If WebGL is missing, the portrait image already in the page stays.
import * as THREE from './vendor/three.module.min.js';
import { OrbitControls } from './vendor/OrbitControls.js';

const box = document.querySelector('[data-avatar3d]');
if (box) start(box).catch(e => console.warn('3D figure not available:', e));

function loadImage(src) {
  return new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = src; });
}

async function start(box) {
  const test = document.createElement('canvas');
  if (!(test.getContext('webgl2') || test.getContext('webgl'))) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = box.querySelector('.av-stage');
  const bubble = box.querySelector('.av-bubble');
  const sayBtn = box.querySelector('[data-say]');
  const faceImg = await loadImage(box.dataset.face);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0.9, 2.5, 8.2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2.05, 0);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 4.5;
  controls.maxDistance = 10.5;
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
  const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(3, 5, 4); scene.add(key);
  const rimGold = new THREE.DirectionalLight(0xf5a524, 1.5); rimGold.position.set(-3.5, 3, -4); scene.add(rimGold);
  const rimRed = new THREE.DirectionalLight(0xff3355, 0.9); rimRed.position.set(4, 2, -3); scene.add(rimRed);

  // ---------- materials ----------
  const mat = (color, rough = 0.7) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 });
  const SKIN = mat(0xb4703f, 0.6);          // matched to the face picture
  const SKIN_DARK = mat(0x9a5c32, 0.65);
  const HAIR = mat(0x1a1816, 0.55);
  const GOLD = mat(0xf2c21b, 0.45);
  const PANTS = mat(0x18181c, 0.85);
  const SHOE = mat(0xe9e9e9, 0.5);
  const SOLE = mat(0x2b2b2b, 0.8);
  const JERSEY_PLAIN = mat(0x141417, 0.75);

  // ---------- SGC KINGSMEN jersey texture (front centre at u = 0.5, back at the seam) ----------
  const jc = document.createElement('canvas'); jc.width = 2048; jc.height = 680;
  const g = jc.getContext('2d');
  g.fillStyle = '#141417'; g.fillRect(0, 0, 2048, 680);
  g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2;                 // scratch pattern
  for (let i = 0; i < 260; i++) { const x = Math.random() * 2048, y = Math.random() * 680; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 40 - Math.random() * 80, y + 40 - Math.random() * 80); g.stroke(); }
  const F = 1024;                                                          // front centre
  // two thin gold stripes rising from his right hip across the chest
  g.save(); g.translate(F - 40, 470); g.rotate(-0.22);
  g.fillStyle = '#f2c21b'; g.fillRect(-520, -10, 1040, 9); g.fillRect(-470, 14, 900, 7);
  g.restore();
  // "S" logo (viewer's left = his right chest)
  g.save(); g.translate(F - 170, 150);
  g.strokeStyle = '#e8eef8'; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 38, 0.6, Math.PI * 1.45); g.stroke();
  g.strokeStyle = '#3d7fe0'; g.beginPath(); g.arc(0, 0, 38, Math.PI * 1.6, Math.PI * 2.45); g.stroke();
  g.fillStyle = '#e8eef8'; g.font = '900 52px Outfit, "Segoe UI", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('S', 0, 2);
  g.restore();
  // "K" crown logo (his left chest)
  g.save(); g.translate(F + 170, 150);
  g.fillStyle = '#f2c21b'; g.font = '900 78px Outfit, "Segoe UI", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('K', 0, 6);
  g.beginPath(); g.moveTo(-22, -40); g.lineTo(-12, -58); g.lineTo(0, -44); g.lineTo(12, -58); g.lineTo(22, -40); g.closePath(); g.fill();
  g.restore();
  // "SGC KINGSMEN" across the chest
  g.fillStyle = '#f2c21b'; g.font = '700 54px Outfit, "Segoe UI", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('SGC KINGSMEN', F, 262);
  // back: crown and ARES (drawn at both edges so it crosses the seam cleanly)
  for (const bx of [0, 2048]) {
    g.save(); g.translate(bx, 0);
    g.fillStyle = '#f2c21b'; g.font = '800 120px Outfit, "Segoe UI", Arial, sans-serif'; g.fillText('ARES', 0, 250);
    g.beginPath(); g.moveTo(-60, 150); g.lineTo(-40, 100); g.lineTo(-15, 135); g.lineTo(0, 92); g.lineTo(15, 135); g.lineTo(40, 100); g.lineTo(60, 150); g.closePath(); g.fill();
    g.restore();
  }
  const jerseyTex = new THREE.CanvasTexture(jc); jerseyTex.colorSpace = THREE.SRGBColorSpace; jerseyTex.anisotropy = 8;
  const JERSEY = new THREE.MeshStandardMaterial({ map: jerseyTex, roughness: 0.75 });

  // sleeve texture with a small Bangladesh flag
  const sc2 = document.createElement('canvas'); sc2.width = 256; sc2.height = 128;
  const sg2 = sc2.getContext('2d'); sg2.fillStyle = '#141417'; sg2.fillRect(0, 0, 256, 128);
  sg2.fillStyle = '#006a4e'; sg2.fillRect(108, 40, 46, 30); sg2.fillStyle = '#f42a41'; sg2.beginPath(); sg2.arc(128, 55, 9, 0, Math.PI * 2); sg2.fill();
  const flagTex = new THREE.CanvasTexture(sc2); flagTex.colorSpace = THREE.SRGBColorSpace;
  const SLEEVE_FLAG = new THREE.MeshStandardMaterial({ map: flagTex, roughness: 0.75 });

  const S = (r, w = 32, h = 24) => new THREE.SphereGeometry(r, w, h);
  const add = (parent, geo, material, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) => {
    const m = new THREE.Mesh(geo, material); m.position.set(x, y, z); m.scale.set(sx, sy, sz); parent.add(m); return m;
  };

  const me = new THREE.Group(); scene.add(me);
  const body = new THREE.Group(); me.add(body);

  // ---------- legs + shoes ----------
  for (const s of [-1, 1]) {
    add(body, new THREE.CylinderGeometry(0.17, 0.15, 0.82, 20), PANTS, s * 0.21, 0.55, 0);
    add(body, new THREE.BoxGeometry(0.3, 0.16, 0.48), SHOE, s * 0.22, 0.1, 0.07);
    add(body, new THREE.BoxGeometry(0.31, 0.05, 0.5), SOLE, s * 0.22, 0.02, 0.07);
  }
  add(body, new THREE.CylinderGeometry(0.42, 0.4, 0.28, 24), PANTS, 0, 1.0, 0);

  // ---------- torso (jersey) ----------
  const torso = add(body, new THREE.CylinderGeometry(0.5, 0.43, 0.95, 48, 1, true, Math.PI, Math.PI * 2), JERSEY, 0, 1.6, 0);
  torso.scale.z = 0.86;
  add(body, S(0.5, 32, 16), JERSEY_PLAIN, 0, 2.07, 0, 1, 0.32, 0.86);
  add(body, new THREE.CylinderGeometry(0.43, 0.43, 0.02, 32), JERSEY_PLAIN, 0, 1.13, 0);
  add(body, new THREE.TorusGeometry(0.17, 0.04, 12, 32), GOLD, 0, 2.17, 0).rotation.x = Math.PI / 2;
  add(body, new THREE.CylinderGeometry(0.15, 0.16, 0.24, 20), SKIN, 0, 2.25, 0);

  // ---------- arms ----------
  function arm(side, flag) {
    const pivot = new THREE.Group(); pivot.position.set(side * 0.56, 1.98, 0); body.add(pivot);
    add(pivot, new THREE.CylinderGeometry(0.15, 0.14, 0.32, 20, 1, true, Math.PI * (side > 0 ? 0 : 1), Math.PI * 2), flag ? SLEEVE_FLAG : JERSEY_PLAIN, 0, -0.14, 0);
    add(pivot, new THREE.TorusGeometry(0.14, 0.028, 8, 24), GOLD, 0, -0.3, 0).rotation.x = Math.PI / 2;
    add(pivot, new THREE.CylinderGeometry(0.11, 0.1, 0.55, 18), SKIN, 0, -0.55, 0);
    const hand = add(pivot, S(0.13), SKIN, 0, -0.86, 0.02, 1, 1.05, 0.95);
    pivot.rotation.z = side * 0.12;
    return { pivot, hand };
  }
  const armL = arm(1, false);
  const armR = arm(-1, true);   // flag on his right sleeve; this arm does the fist pump

  // ---------- head with Ador's face ----------
  // An oval head shaped to the face picture (width : height = 0.632).
  const FRONT = 0.82;                                   // the face covers the front 0.18π..0.82π of the head
  const RX = 0.46 / Math.cos(Math.PI * 0.18) * 1.0, RY = 0.46 / 0.632, RZ = 0.5;   // RX ≈ 0.545, RY ≈ 0.73
  const head = new THREE.Group(); head.position.set(0, 2.25 + RY * 0.86, 0); body.add(head);
  add(head, S(1, 48, 36), SKIN, 0, 0, 0, RX, RY, RZ);                              // skin base
  for (const s of [-1, 1]) add(head, S(0.1), SKIN_DARK, s * (RX + 0.005), -0.04, 0, 0.5, 1.3, 0.85); // ears
  // hair: covers the top, sides and back (the face picture's own hair blends into it at the front)
  // one hair shell over the top, sides and back; the face (slightly bigger, drawn in front) covers it at the front
  const capGeo = new THREE.SphereGeometry(1.015, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.56);
  capGeo.rotateX(-0.32);                                // tilt before stretching, so it stays inside the face shell
  add(head, capGeo, HAIR, 0, 0, 0, RX, RY, RZ);

  // face: front half of a slightly bigger oval, picture projected straight on
  const faceGeo = new THREE.SphereGeometry(1.03, 64, 48, Math.PI * (1 - FRONT), Math.PI * (2 * FRONT - 1), 0, Math.PI);
  const XSPAN = 1.03 * Math.cos(Math.PI * (1 - FRONT));
  const fp = faceGeo.attributes.position, fuv = faceGeo.attributes.uv;
  for (let i = 0; i < fp.count; i++) fuv.setXY(i, (fp.getX(i) / XSPAN + 1) / 2, (fp.getY(i) / 1.03 + 1) / 2);
  const faceTex = new THREE.Texture(faceImg); faceTex.colorSpace = THREE.SRGBColorSpace; faceTex.anisotropy = 8; faceTex.needsUpdate = true;
  const FACE = new THREE.MeshStandardMaterial({ map: faceTex, transparent: true, roughness: 0.7, emissive: 0xffffff, emissiveMap: faceTex, emissiveIntensity: 0.28 });
  const face = add(head, faceGeo, FACE, 0, 0, 0, RX, RY, RZ);
  face.renderOrder = 2;

  // soft round shadow under the feet
  const shc = document.createElement('canvas'); shc.width = shc.height = 128;
  const shg = shc.getContext('2d'); const grd = shg.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,.55)'); grd.addColorStop(1, 'rgba(0,0,0,0)'); shg.fillStyle = grd; shg.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; me.add(shadow);

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  // ---------- "Never give up!" ----------
  let talkStart = -10;
  function say(withVoice) {
    talkStart = performance.now() / 1000;
    bubble.classList.add('show');
    clearTimeout(say.t); say.t = setTimeout(() => bubble.classList.remove('show'), 2600);
    if (withVoice && 'speechSynthesis' in window) {
      try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance('Never give up!'); u.rate = 0.95; u.pitch = 0.9; u.lang = 'en-US'; speechSynthesis.speak(u); } catch (e) { /* optional */ }
    }
  }
  if (sayBtn) sayBtn.addEventListener('click', () => say(true));
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.05 }).observe(box);
  setTimeout(() => say(false), 1200);
  setInterval(() => { if (!document.hidden && visible) say(false); }, 8000);

  box.classList.add('ready');
  const clock = new THREE.Clock();
  (function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime(), k = performance.now() / 1000 - talkStart;
    const talking = k >= 0 && k < 1.6;
    if (!reduce) {
      body.position.y = Math.sin(t * 2) * 0.025;
      head.rotation.y = Math.sin(t * 0.7) * 0.15;
      head.rotation.x = Math.sin(t * 0.9) * 0.03 + (talking ? Math.sin(k * 7) * 0.04 : 0);
      armL.pivot.rotation.x = Math.sin(t * 1.3) * 0.08;
    }
    const pump = talking ? Math.sin(Math.min(k / 0.35, 1) * Math.PI / 2) : (k > 1.6 && k < 2 ? 1 - (k - 1.6) / 0.4 : 0);
    armR.pivot.rotation.x = -2.5 * pump + (reduce ? 0 : Math.sin(t * 1.3 + 1) * 0.08 * (1 - pump));
    armR.pivot.rotation.z = -0.12 - 0.35 * pump + (talking ? Math.sin(k * 14) * 0.06 : 0);
    controls.update();
    renderer.render(scene, camera);
  })();
}
