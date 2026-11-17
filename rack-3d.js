/* AЯRV — Cinematic 3D garment rack
   Real front/back garment cut-outs on a curved cloth surface. Drag each shirt to rotate 360°.
   Product gallery photos are the user's approved real product references; the rack uses clean
   alpha cut-outs so the original photographic studio background is not repeated four times.
*/
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const root = document.getElementById('rack3d');
if (root) {
  const products = [
    { id: 'archive-001', front: 'img/archive-001-front-3d-cut.png', back: 'img/archive-001-back-3d-cut.png' },
    { id: 'archive-002', front: 'img/archive-002-front-3d-cut.png', back: 'img/archive-002-back-3d-cut.png' },
    { id: 'archive-003', front: 'img/archive-003-front-3d-cut.png', back: 'img/archive-003-back-3d-cut.png' },
    { id: 'archive-004', front: 'img/archive-004-front-3d-cut.png', back: 'img/archive-004-back-3d-cut.png' }
  ];

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x11100e, 13, 26);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  camera.position.set(0, 0.15, 13.1);
  camera.lookAt(0, 0.05, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label', 'Rak 3D AЯRV. Seret setiap kaos untuk melihat sisi depan dan belakang hingga 360 derajat.');
  renderer.domElement.setAttribute('role', 'application');
  renderer.domElement.setAttribute('aria-describedby', 'rack3d-instructions');
  root.appendChild(renderer.domElement);

  // Warm cinematic key light, soft fill, and a narrow amber rim.
  scene.add(new THREE.HemisphereLight(0xd7d4cb, 0x17130f, 1.05));
  const key = new THREE.SpotLight(0xffd5a6, 145, 26, Math.PI / 4.4, 0.68, 1.25);
  key.position.set(-4.8, 7.5, 6.2); key.target.position.set(0, 0, 0); key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536); key.shadow.bias = -0.00012;
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xb8c6d2, 1.35); fill.position.set(5.5, 2.8, 5); scene.add(fill);
  const rim = new THREE.PointLight(0xd69a5c, 35, 16, 2); rim.position.set(-4.5, 1.2, -2.8); scene.add(rim);
  const top = new THREE.PointLight(0xffe0b8, 19, 13, 2); top.position.set(1.8, 5.2, 1.8); scene.add(top);

  const metal = new THREE.MeshStandardMaterial({ color: 0x171918, metalness: 0.9, roughness: 0.24 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x85847c, metalness: 0.94, roughness: 0.19 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x714a2e, roughness: 0.46, metalness: 0.02 });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x352319, roughness: 0.65 });
  const seam = new THREE.MeshStandardMaterial({ color: 0x202321, roughness: 0.92 });

  function tube(points, radius, material, parent, segments = 36) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 9, false), material);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function cylinderBetween(a, b, radius, material) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const d = new THREE.Vector3().subVectors(end, start);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, d.length(), 20), material);
    m.position.copy(start).add(end).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    m.castShadow = true; scene.add(m); return m;
  }

  // Heavy black steel rack with rounded end caps and weighted feet.
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(.043, .043, 10.5, 32), metal);
  rail.rotation.z = Math.PI / 2; rail.position.set(0, 2.18, -.12); rail.castShadow = true; scene.add(rail);
  [-5.22, 5.22].forEach(x => {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(.064, 18, 14), steel); cap.position.set(x, 2.18, -.12); scene.add(cap);
    cylinderBetween([x, 2.14, -.12], [x, -1.48, -.12], .034, metal);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(.24, .27, .075, 28), metal);
    foot.position.set(x, -1.5, -.12); foot.castShadow = true; scene.add(foot);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(.055, .012, 8, 24), steel);
    collar.rotation.x = Math.PI / 2; collar.position.set(x, 2.02, -.12); scene.add(collar);
  });

  // Matte floor and a restrained warm wall glow.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 16), new THREE.MeshStandardMaterial({ color: 0x171512, roughness: .96, metalness: .02 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, -1.55, -1.8); floor.receiveShadow = true; scene.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(25, 12), new THREE.MeshStandardMaterial({ color: 0x171512, roughness: 1, metalness: 0 }));
  wall.position.set(0, 1.7, -4.3); wall.receiveShadow = true; scene.add(wall);

  // Fine woven normal/bump detail, subtle enough not to obscure the printed artwork.
  const noise = document.createElement('canvas'); noise.width = noise.height = 128;
  const ctx = noise.getContext('2d'); const pixels = ctx.createImageData(128, 128);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const n = 118 + Math.floor(Math.random() * 22);
    pixels.data[i] = n; pixels.data[i + 1] = n; pixels.data[i + 2] = n; pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  const weave = new THREE.CanvasTexture(noise); weave.wrapS = weave.wrapT = THREE.RepeatWrapping; weave.repeat.set(4, 5);

  // Cloth has a gently rounded chest, vertical gravity folds, and irregular hem drape.
  function clothGeometry(width, height, side) {
    const geo = new THREE.PlaneGeometry(width, height, 52, 64);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const nx = x / (width * .5), ny = y / (height * .5);
      const shoulder = Math.exp(-Math.pow((ny - .63) * 3.4, 2));
      const sideDrape = Math.pow(Math.abs(nx), 1.7) * Math.sin(ny * 7.5 + nx * 2.1) * .025;
      const verticalFold = Math.sin(nx * 18 + .8) * .012 * (0.35 + Math.max(0, ny));
      const hemWave = Math.sin(nx * 7.5 + side * .5) * .025 * Math.pow(Math.max(0, -ny), 2);
      const chestBow = .11 * (1 - nx * nx) * (0.45 + shoulder * .55);
      p.setZ(i, chestBow + sideDrape + verticalFold + hemWave + side * .002);
    }
    geo.computeVertexNormals(); return geo;
  }

  const loader = new THREE.TextureLoader();
  const shirts = [];
  function makeHanger(group) {
    // Wide contoured wooden shoulders, center spine, and a real metal hook.
    tube([[-.83, 1.18, -.13], [-.64, 1.27, -.13], [-.34, 1.39, -.13], [0, 1.44, -.13], [.34, 1.39, -.13], [.64, 1.27, -.13], [.83, 1.18, -.13]], .062, wood, group, 48);
    tube([[-.08, 1.40, -.13], [0, 1.20, -.13], [.08, 1.40, -.13]], .032, darkWood, group, 18);
    tube([[0, 1.43, -.13], [0, 1.66, -.13], [.025, 1.88, -.13], [.15, 1.98, -.13], [.27, 1.91, -.13], [.27, 1.79, -.13]], .022, steel, group, 32);
    const neck = new THREE.Mesh(new THREE.TorusGeometry(.085, .018, 8, 24), steel);
    neck.rotation.x = Math.PI / 2; neck.position.set(0, 1.43, -.13); group.add(neck);
  }

  products.forEach((product, index) => {
    const group = new THREE.Group();
    group.position.set((index - 1.5) * 2.48, -.12, 0);
    scene.add(group); makeHanger(group);

    const loadTexture = path => {
      const t = loader.load(path, tex => { tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); });
      t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; return t;
    };
    const frontTexture = loadTexture(product.front);
    const backTexture = loadTexture(product.back);
    const material = texture => new THREE.MeshPhysicalMaterial({
      map: texture, bumpMap: weave, bumpScale: .008, roughness: .985, metalness: 0,
      clearcoat: .015, clearcoatRoughness: .9, transparent: true, alphaTest: .12,
      side: THREE.DoubleSide, depthWrite: true
    });

    const w = 2.35, h = 2.43;
    const front = new THREE.Mesh(clothGeometry(w, h, 1), material(frontTexture));
    front.position.set(0, -.10, .08); front.castShadow = true; front.receiveShadow = true; group.add(front);
    const back = new THREE.Mesh(clothGeometry(w, h, -1), material(backTexture));
    back.position.set(0, -.10, -.08); back.rotation.y = Math.PI; back.castShadow = true; back.receiveShadow = true; group.add(back);

    // Subtle collar and shoulder seam detail sit behind the photo cut-out's own ribbing.
    const collar = new THREE.Mesh(new THREE.TorusGeometry(.255, .018, 8, 40), seam);
    collar.position.set(0, .99, .115); collar.scale.set(1.12, .57, 1); group.add(collar);

    group.userData.productId = product.id;
    group.userData.baseY = group.position.y;
    group.userData.dragVelocity = 0;
    group.userData.targetScale = index === 0 ? 1.03 : .93;
    group.userData.targetY = group.position.y + (index === 0 ? .045 : -.025);
    shirts.push({ group, id: product.id, index });
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let active = shirts[0] || null;
  let dragging = false, down = null, lastX = 0, moved = false, lastTime = 0;
  function pointerAt(e) {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  function hit(e) {
    pointerAt(e); raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(shirts.map(s => s.group), true);
    if (!intersections.length) return null;
    let o = intersections[0].object; while (o && !o.userData.productId) o = o.parent;
    return o ? shirts.find(s => s.group === o) || null : null;
  }
  function select(item) {
    if (!item) return; active = item;
    shirts.forEach(s => {
      const chosen = s === item;
      s.group.userData.targetScale = chosen ? 1.04 : .93;
      s.group.userData.targetY = s.group.userData.baseY + (chosen ? .045 : -.025);
    });
    window.dispatchEvent(new CustomEvent('aarv:select', { detail: { id: item.id } }));
  }
  renderer.domElement.addEventListener('pointerdown', e => {
    const item = hit(e); if (!item) return;
    down = item; dragging = true; moved = false; lastX = e.clientX; lastTime = performance.now();
    item.group.userData.dragVelocity = 0; renderer.domElement.setPointerCapture(e.pointerId); renderer.domElement.style.cursor = 'grabbing';
  });
  renderer.domElement.addEventListener('pointermove', e => {
    if (!dragging) { renderer.domElement.style.cursor = hit(e) ? 'grab' : 'default'; return; }
    const dx = e.clientX - lastX; if (Math.abs(dx) > 1) moved = true;
    if (down) {
      const dt = Math.max(8, performance.now() - lastTime);
      const delta = dx * .0105;
      down.group.rotation.y += delta;
      down.group.userData.dragVelocity = delta / dt * 16;
    }
    lastX = e.clientX; lastTime = performance.now();
  });
  function endDrag() {
    if (!dragging) return; dragging = false; renderer.domElement.style.cursor = 'grab';
    if (down && !moved) select(down); else if (down) active = down;
    down = null;
  }
  renderer.domElement.addEventListener('pointerup', endDrag);
  renderer.domElement.addEventListener('pointercancel', endDrag);
  renderer.domElement.addEventListener('lostpointercapture', endDrag);
  renderer.domElement.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const item = active || shirts[0]; if (!item) return;
    item.group.rotation.y += e.key === 'ArrowLeft' ? .22 : -.22; e.preventDefault();
  });
  renderer.domElement.tabIndex = 0;

  function resize() {
    const width = root.clientWidth || 900, height = root.clientHeight || 480;
    const compact = width < 700;
    const gap = compact ? 1.76 : 2.48;
    shirts.forEach((s, i) => { s.group.position.x = (i - 1.5) * gap; });
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.position.z = compact ? 14.8 : 13.1; camera.fov = compact ? 37 : 32;
    camera.updateProjectionMatrix();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(root); else window.addEventListener('resize', resize);
  resize();
  window.addEventListener('aarv:select', e => {
    const item = shirts.find(s => s.id === e.detail?.id); if (item && item !== active) select(item);
  });

  const clock = new THREE.Clock();
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    shirts.forEach((s, i) => {
      const g = s.group;
      if (!dragging || down !== s) {
        if (Math.abs(g.userData.dragVelocity) > .0005) { g.rotation.y += g.userData.dragVelocity; g.userData.dragVelocity *= .91; }
        else if (s !== active && !reduceMotion) g.rotation.y += (Math.sin(time * .24 + i * .65) * .018 - g.rotation.y) * .009;
      }
      const y = g.userData.targetY ?? g.userData.baseY;
      g.position.y += (y + (reduceMotion ? 0 : Math.sin(time * .55 + i * .7) * .008) - g.position.y) * .035;
      const target = g.userData.targetScale ?? 1;
      const scale = g.scale.x + (target - g.scale.x) * .045; g.scale.setScalar(scale);
    });
    renderer.render(scene, camera);
  }
  animate();
  root.classList.add('rack-3d-ready');
}
