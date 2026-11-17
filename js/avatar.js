// Animated 3D portrait of Ador for the homepage hero.
// The approved animated-style portrait (images/ador-animated.jpg) is laid on a finely divided surface that is pushed
// forward by a hand-made depth map (images/ador-animated-depth.png: nose closest, then face, ears, neck, shoulders).
// Dragging turns it in real 3D (about 25° each way: the picture only shows the front). It breathes, sways, nods and
// says "Never give up!" in a bubble; "Hear it" speaks the line with the browser's voice.
// If WebGL is missing, the normal photo already in the page stays.
import * as THREE from './vendor/three.module.min.js';

const box = document.querySelector('[data-avatar3d]');
if (box) start(box).catch(e => console.warn('3D portrait not available:', e));

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
  const [photo, depthImg] = await Promise.all([loadImage(box.dataset.photo), loadImage(box.dataset.depth)]);

  // ---------- depth samples ----------
  const dc = document.createElement('canvas'); dc.width = depthImg.width; dc.height = depthImg.height;
  const dctx = dc.getContext('2d', { willReadFrequently: true }); dctx.drawImage(depthImg, 0, 0);
  const dd = dctx.getImageData(0, 0, dc.width, dc.height).data;
  const depthAt = (u, v) => {               // bilinear sample, u/v in 0..1 (v = 0 at the top)
    const x = u * (dc.width - 1), y = v * (dc.height - 1);
    const x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(x0 + 1, dc.width - 1), y1 = Math.min(y0 + 1, dc.height - 1);
    const fx = x - x0, fy = y - y0, p = (xx, yy) => dd[(yy * dc.width + xx) * 4] / 255;
    return (p(x0, y0) * (1 - fx) + p(x1, y0) * fx) * (1 - fy) + (p(x0, y1) * (1 - fx) + p(x1, y1) * fx) * fy;
  };

  // ---------- renderer / scene ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 20);

  // ---------- the portrait surface ----------
  const aspect = photo.height / photo.width;          // ~1.24
  const PW = 1, PH = aspect, DEPTH = 0.22;
  const geo = new THREE.PlaneGeometry(PW, PH, 220, Math.round(220 * aspect));
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, depthAt(uv.getX(i), 1 - uv.getY(i)) * DEPTH);
  geo.computeVertexNormals();

  const tex = new THREE.Texture(photo); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.needsUpdate = true;
  // soft fade at the picture's edges so the rectangle never shows when it turns
  const ac = document.createElement('canvas'); ac.width = 256; ac.height = Math.round(256 * aspect);
  const ag = ac.getContext('2d'); ag.fillStyle = '#000'; ag.fillRect(0, 0, ac.width, ac.height);
  ag.filter = 'blur(14px)'; ag.fillStyle = '#fff'; ag.fillRect(22, 18, ac.width - 44, ac.height + 40); ag.filter = 'none';
  const alphaTex = new THREE.CanvasTexture(ac);
  const mat = new THREE.MeshStandardMaterial({ map: tex, alphaMap: alphaTex, transparent: true, roughness: 0.9, metalness: 0 });
  const portrait = new THREE.Mesh(geo, mat);
  const rig = new THREE.Group(); rig.add(portrait); scene.add(rig);
  portrait.position.z = -0.15;                         // turn around the middle of the head, not the back of the picture

  scene.add(new THREE.AmbientLight(0xffffff, 1.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(0.8, 0.6, 2); scene.add(key);
  const rim = new THREE.DirectionalLight(0xf5a524, 0.9); rim.position.set(-2, 0.5, -0.5); scene.add(rim);

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0, Math.max((PH * 0.56) / tanHalf, (PW * 0.56) / (tanHalf * camera.aspect)));
    camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  // ---------- drag to turn ----------
  const MAX_YAW = 0.45, MAX_PITCH = 0.18;
  let yaw = 0, pitch = 0, tYaw = 0, tPitch = 0, dragging = false, sx = 0, sy = 0, sYaw = 0, sPitch = 0, lastTouch = -10;
  const el = renderer.domElement;
  el.style.touchAction = 'pan-y';
  el.addEventListener('pointerdown', e => { dragging = true; sx = e.clientX; sy = e.clientY; sYaw = tYaw; sPitch = tPitch; el.setPointerCapture(e.pointerId); box.classList.add('touched'); });
  el.addEventListener('pointermove', e => {
    if (!dragging) return;
    const w = stage.clientWidth || 300;
    tYaw = THREE.MathUtils.clamp(sYaw + (e.clientX - sx) / w * 2.2, -MAX_YAW, MAX_YAW);
    tPitch = THREE.MathUtils.clamp(sPitch + (e.clientY - sy) / w * 1.2, -MAX_PITCH, MAX_PITCH);
    lastTouch = performance.now() / 1000;
  });
  const end = () => { dragging = false; lastTouch = performance.now() / 1000; };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);

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
  setTimeout(() => say(false), 1400);
  setInterval(() => { if (!document.hidden && visible) say(false); }, 8000);

  box.classList.add('ready');
  const clock = new THREE.Clock();
  (function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime(), now = performance.now() / 1000, k = now - talkStart;
    const idle = !dragging && now - lastTouch > 4;
    if (idle && !reduce) {                          // slow look left and right when nobody is dragging
      tYaw += (Math.sin(t * 0.45) * 0.3 - tYaw) * 0.02;
      tPitch += (Math.sin(t * 0.3) * 0.05 - tPitch) * 0.02;
    }
    yaw += (tYaw - yaw) * 0.12; pitch += (tPitch - pitch) * 0.12;
    const nod = k >= 0 && k < 1.4 ? Math.sin(k / 1.4 * Math.PI * 2) * 0.06 : 0;   // small nod while "speaking"
    rig.rotation.set(pitch + nod, yaw, 0);
    if (!reduce) { const b = 1 + Math.sin(t * 1.8) * 0.006; rig.scale.set(b, b, 1); }
    key.position.x = 0.8 + Math.sin(t * 0.6) * 0.6;   // light drifts slowly across the face
    renderer.render(scene, camera);
  })();
}
