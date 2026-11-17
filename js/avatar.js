// Full-body 3D figure of Ador for the homepage hero, made from his approved front and back pictures.
// Each picture is cut out (images/ador-front.webp, images/ador-back.webp) and pushed into a rounded relief by its own
// depth map (images/ador-*-depth.png: thickest in the middle of each body part, zero at the outline). The two reliefs
// share the same outline, so together they form one solid figure that can be turned all the way round.
// Only a front and a back picture exist, so the turn lingers on the front and back and passes quickly through the
// thin side view; after a drag it settles on whichever side is nearer. It turns slowly by itself, breathes, and says "Never give up!" in a bubble; "Hear it" speaks the line.
// If WebGL is missing, the front picture already in the page stays.
import * as THREE from './vendor/three.module.min.js';

const box = document.querySelector('[data-avatar3d]');
if (box) start(box).catch(e => console.warn('3D figure not available:', e));

function loadImage(src) {
  return new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = src; });
}
function pixels(img) {
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
  return { w: c.width, h: c.height, d: x.getImageData(0, 0, c.width, c.height).data };
}
function sampler(p) {                         // bilinear sample of the red channel, u/v in 0..1, v = 0 at the top
  return (u, v) => {
    const x = Math.min(Math.max(u, 0), 1) * (p.w - 1), y = Math.min(Math.max(v, 0), 1) * (p.h - 1);
    const x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(x0 + 1, p.w - 1), y1 = Math.min(y0 + 1, p.h - 1);
    const fx = x - x0, fy = y - y0, q = (xx, yy) => p.d[(yy * p.w + xx) * 4] / 255;
    return (q(x0, y0) * (1 - fx) + q(x1, y0) * fx) * (1 - fy) + (q(x0, y1) * (1 - fx) + q(x1, y1) * fx) * fy;
  };
}

async function start(box) {
  const test = document.createElement('canvas');
  if (!(test.getContext('webgl2') || test.getContext('webgl'))) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = box.querySelector('.av-stage');
  const bubble = box.querySelector('.av-bubble');
  const sayBtn = box.querySelector('[data-say]');
  const [front, back, frontD, backD] = await Promise.all(
    ['front', 'back', 'frontDepth', 'backDepth'].map(k => loadImage(box.dataset[k])));

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);

  // ---------- the figure: two reliefs, front and back, sharing one outline ----------
  const H = 2, W = H * front.width / front.height;        // figure is 2 units tall
  const THICK = 0.15;                                     // max depth of each side (a body ~0.3 deep)
  function relief(img, depthImg, sign) {
    const geo = new THREE.PlaneGeometry(W, H, 180, Math.round(180 * H / W));
    const pos = geo.attributes.position, uv = geo.attributes.uv, depthAt = sampler(pixels(depthImg));
    for (let i = 0; i < pos.count; i++) pos.setZ(i, depthAt(uv.getX(i), 1 - uv.getY(i)) * THICK);
    geo.computeVertexNormals();
    const tex = new THREE.Texture(img); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.5, roughness: 0.85, metalness: 0,
      emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.45, side: THREE.FrontSide });
    const mesh = new THREE.Mesh(geo, mat);
    if (sign < 0) mesh.rotation.y = Math.PI;              // the back relief faces the other way
    return mesh;
  }
  const figure = new THREE.Group();
  figure.add(relief(front, frontD, 1));
  figure.add(relief(back, backD, -1));
  figure.position.y = H / 2;                              // feet on the floor
  const rig = new THREE.Group(); rig.add(figure); scene.add(rig);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(2, 3, 3); scene.add(key);
  const rim = new THREE.DirectionalLight(0xf5a524, 1.0); rim.position.set(-3, 2, -2); scene.add(rim);

  // soft round shadow under the feet
  const shc = document.createElement('canvas'); shc.width = shc.height = 128;
  const shg = shc.getContext('2d'); const grd = shg.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,.55)'); grd.addColorStop(1, 'rgba(0,0,0,0)'); shg.fillStyle = grd; shg.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01; scene.add(shadow);

  // ---------- camera and turning ----------
  camera.position.set(0, 1.08, 4.5); camera.lookAt(0, 1.0, 0);
  // "angle" is what the viewer controls; the figure shows warp(angle), which is slow near the front and back
  // and fast through the sides (the sides are only as thick as the two pictures allow).
  const WARP = 0.62, TAU = Math.PI * 2;
  const warp = a => a - WARP * Math.sin(2 * a) / 2;
  let angle = 0, vel = 0, dragging = false, lastX = 0, lastT = 0, idleUntil = 0, settleTo = null;
  const canvas = renderer.domElement;
  canvas.style.touchAction = 'pan-y'; canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; lastT = performance.now(); vel = 0; settleTo = null;
    canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; box.classList.add('touched');
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now = performance.now(), dx = e.clientX - lastX, da = dx / stage.clientWidth * 3.4;
    angle += da; vel = da / Math.max(now - lastT, 8) * 1000; lastX = e.clientX; lastT = now;
  });
  const release = () => {
    if (!dragging) return; dragging = false; canvas.style.cursor = 'grab';
    if (performance.now() - lastT > 80) vel = 0;
    idleUntil = performance.now() + 5000;                 // turn by itself again 5 s after a drag
  };
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
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
  const clock = new THREE.Clock(); clock.getDelta();
  (function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = clock.elapsedTime, k = performance.now() / 1000 - talkStart;
    if (!reduce) {
      const b = 1 + Math.sin(t * 1.8) * 0.004; rig.scale.set(b, b, b);          // breathing
      rig.position.y = k >= 0 && k < 0.8 ? Math.sin(k / 0.8 * Math.PI) * 0.03 : 0;  // small bounce when "speaking"
    }
    const dt = Math.min(clock.getDelta(), 0.05), now = performance.now();
    if (!dragging) {
      if (Math.abs(vel) > 0.05) { angle += vel * dt; vel *= Math.pow(0.04, dt); }   // glide after a flick
      else if (now < idleUntil || reduce) {                                          // come to rest facing front or back
        vel = 0; if (settleTo === null) settleTo = Math.round(angle / Math.PI) * Math.PI;
        angle += (settleTo - angle) * Math.min(1, dt * 4);
      } else { settleTo = null; angle += dt * 0.55; }                               // slow turn by itself
    }
    figure.rotation.y = warp(angle % TAU);
    renderer.render(scene, camera);
  })();
}
