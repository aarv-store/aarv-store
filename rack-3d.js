/* AЯRV — Cinematic 3D Archive Rack
   Real product cut-outs on gently curved cloth meshes, wood hangers and a dark studio rail.
   Drag a shirt horizontally to rotate it through 360 degrees; tap/click to select it.
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
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.25, 12.8);
  camera.lookAt(0, 0.1, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label', 'Rak hanger 3D AЯRV. Seret kaos untuk memutar 360 derajat dan klik untuk memilih desain.');
  renderer.domElement.setAttribute('role', 'application');
  root.appendChild(renderer.domElement);

  // Studio lighting: warm key, cool fill and a soft amber rim.
  scene.add(new THREE.HemisphereLight(0xc8c9c3, 0x10110f, 1.25));
  const key = new THREE.SpotLight(0xffd9ad, 115, 24, Math.PI / 4.2, 0.7, 1.4);
  key.position.set(-3.8, 7.2, 5.5); key.target.position.set(0, 0, 0); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xb7c4d0, 1.7); fill.position.set(5, 2.5, 4); scene.add(fill);
  const rim = new THREE.PointLight(0xc58e53, 28, 15, 2); rim.position.set(-4, 1.4, -2.8); scene.add(rim);
  const topGlow = new THREE.PointLight(0xffd8ad, 16, 11, 2); topGlow.position.set(1.5, 4.4, 2.5); scene.add(topGlow);

  // Matte black rail and supports.
  const blackMetal = new THREE.MeshStandardMaterial({ color: 0x171a18, metalness: 0.82, roughness: 0.28 });
  const brushedMetal = new THREE.MeshStandardMaterial({ color: 0x77766d, metalness: 0.9, roughness: 0.24 });
  function cylinderBetween(a, b, radius, material, segments = 16) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const direction = new THREE.Vector3().subVectors(end, start);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), segments), material);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    mesh.castShadow = true; scene.add(mesh); return mesh;
  }
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 10.2, 28), blackMetal);
  rail.rotation.z = Math.PI / 2; rail.position.set(0, 2.08, -0.05); rail.castShadow = true; scene.add(rail);
  // Small warm metallic end caps.
  [-5.12, 5.12].forEach(x => {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), brushedMetal);
    cap.position.set(x, 2.08, -0.05); scene.add(cap);
    cylinderBetween([x, 2.05, -0.05], [x, -1.42, -0.05], 0.027, blackMetal, 12);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.23, 0.055, 24), blackMetal);
    foot.position.set(x, -1.43, -0.05); scene.add(foot);
  });

  // A subtle studio floor catches a soft shadow beneath the rack.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 13), new THREE.MeshStandardMaterial({ color: 0x111311, roughness: 0.94, metalness: 0.05 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, -1.47, -1.8); floor.receiveShadow = true; scene.add(floor);

  // Fine woven bump texture, deliberately very subtle so the supplied product artwork remains exact.
  const noiseCanvas = document.createElement('canvas'); noiseCanvas.width = 128; noiseCanvas.height = 128;
  const nctx = noiseCanvas.getContext('2d');
  const noiseImage = nctx.createImageData(128, 128);
  for (let i = 0; i < noiseImage.data.length; i += 4) {
    const v = 112 + Math.floor(Math.random() * 32);
    noiseImage.data[i] = v; noiseImage.data[i + 1] = v; noiseImage.data[i + 2] = v; noiseImage.data[i + 3] = 255;
  }
  nctx.putImageData(noiseImage, 0, 0);
  const weave = new THREE.CanvasTexture(noiseCanvas);
  weave.wrapS = weave.wrapT = THREE.RepeatWrapping; weave.repeat.set(5, 5);

  const loader = new THREE.TextureLoader();
  const shirtGroups = [];
  const wood = new THREE.MeshStandardMaterial({ color: 0x62432b, roughness: 0.52, metalness: 0.04 });
  const hookMetal = new THREE.MeshStandardMaterial({ color: 0x9a9b91, metalness: 0.9, roughness: 0.2 });
  const seamMat = new THREE.MeshStandardMaterial({ color: 0x282a27, roughness: 0.88 });

  function addTube(points, radius, material, parent, tubularSegments = 32) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, tubularSegments, radius, 9, false), material);
    mesh.castShadow = true; parent.add(mesh); return mesh;
  }

  // A softly bowed cloth surface: the transparent cut-out carries the real shirt photo,
  // while the curved mesh gives it a little volume and catches studio light while rotating.
  function makeClothGeometry(width, height, zOffset) {
    const geo = new THREE.PlaneGeometry(width, height, 36, 44);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      const nx = x / (width * 0.5), ny = y / (height * 0.5);
      const shoulder = Math.exp(-Math.pow((ny - 0.55) * 3.2, 2));
      const drape = Math.sin((ny + 1) * 8.2 + nx * 2.2) * 0.012 * (1 - Math.min(1, Math.abs(nx)));
      const fold = Math.sin(nx * 13 + ny * 2.5) * 0.009 * (0.4 + shoulder);
      const bow = 0.13 * (1 - nx * nx) + drape + fold + zOffset;
      pos.setZ(i, bow);
    }
    geo.computeVertexNormals();
    return geo;
  }

  products.forEach((p, i) => {
    const group = new THREE.Group();
    group.position.set((i - 1.5) * 2.42, -0.12, 0);
    scene.add(group);

    // The hanger is behind the shirt, with a broad wooden shoulder and polished metal hook.
    addTube([[-0.78, 1.12, -0.11], [-0.55, 1.24, -0.11], [-0.28, 1.33, -0.11], [0, 1.37, -0.11], [0.28, 1.33, -0.11], [0.55, 1.24, -0.11], [0.78, 1.12, -0.11]], 0.052, wood, group, 42);
    addTube([[0, 1.36, -0.11], [0, 1.57, -0.11], [0.02, 1.78, -0.11], [0.13, 1.88, -0.11], [0.24, 1.83, -0.11], [0.24, 1.73, -0.11]], 0.022, hookMetal, group, 28);
    // Hanger center support.
    addTube([[-0.08, 1.34, -0.11], [0, 1.16, -0.11], [0.08, 1.34, -0.11]], 0.026, wood, group, 16);

    const frontTexture = loader.load(p.front, tex => { tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); });
    const backTexture = loader.load(p.back, tex => { tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); });
    frontTexture.minFilter = backTexture.minFilter = THREE.LinearMipmapLinearFilter;
    const shirtMaterial = texture => new THREE.MeshStandardMaterial({
      map: texture, bumpMap: weave, bumpScale: 0.012, roughness: 0.96, metalness: 0,
      transparent: true, alphaTest: 0.08, side: THREE.DoubleSide
    });

    const clothWidth = 2.45, clothHeight = 2.30;
    // Thin, beveled tee silhouette adds real edge thickness when the garment turns sideways.
    const teeShape = new THREE.Shape();
    teeShape.moveTo(-0.48, 1.10);
    teeShape.lineTo(-1.02, 0.91); teeShape.lineTo(-1.27, 0.28);
    teeShape.lineTo(-1.00, 0.08); teeShape.lineTo(-0.82, 0.39);
    teeShape.lineTo(-0.82, -1.13); teeShape.lineTo(0.82, -1.13);
    teeShape.lineTo(0.82, 0.39); teeShape.lineTo(1.00, 0.08);
    teeShape.lineTo(1.27, 0.28); teeShape.lineTo(1.02, 0.91);
    teeShape.lineTo(0.48, 1.10);
    teeShape.quadraticCurveTo(0.34, 0.79, 0, 0.77);
    teeShape.quadraticCurveTo(-0.34, 0.79, -0.48, 1.10);
    teeShape.closePath();
    const bodyGeo = new THREE.ExtrudeGeometry(teeShape, { depth: 0.12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.025, bevelThickness: 0.025, curveSegments: 16 });
    bodyGeo.center();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x090b0a, roughness: 0.97, metalness: 0.0, bumpMap: weave, bumpScale: 0.018 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, -0.02, 0); body.castShadow = true; body.receiveShadow = true; group.add(body);

    const front = new THREE.Mesh(makeClothGeometry(clothWidth, clothHeight, 0.09), shirtMaterial(frontTexture));
    front.position.set(0, -0.02, 0.085); front.castShadow = true; front.receiveShadow = true; group.add(front);
    const back = new THREE.Mesh(makeClothGeometry(clothWidth, clothHeight, -0.09), shirtMaterial(backTexture));
    back.position.set(0, -0.02, -0.085); back.rotation.y = Math.PI; back.castShadow = true; back.receiveShadow = true; group.add(back);

    // Tiny collar/rib detail, visible above the neck opening in the product cut-out.
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.025, 8, 36), seamMat);
    collar.position.set(0, 1.00, 0.11); collar.scale.set(1.15, 0.55, 1); group.add(collar);

    group.userData.productId = p.id;
    group.userData.baseY = group.position.y;
    group.userData.baseX = group.position.x;
    group.userData.dragVelocity = 0;
    shirtGroups.push({ group, id: p.id, index: i });
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let active = shirtGroups[0] || null;
  shirtGroups.forEach((s, i) => {
    s.group.userData.targetScale = i === 0 ? 1.04 : 0.91;
    s.group.userData.targetY = s.group.userData.baseY + (i === 0 ? 0.08 : -0.035);
  });
  let dragging = false, lastX = 0, moved = false, downGroup = null, lastMoveTime = 0;

  function updatePointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }
  function pick(event) {
    updatePointer(event); raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(shirtGroups.map(s => s.group), true);
    if (!intersections.length) return null;
    let object = intersections[0].object;
    while (object && !object.userData.productId) object = object.parent;
    return object ? shirtGroups.find(s => s.group === object) || null : null;
  }
  function selectShirt(item) {
    if (!item) return;
    active = item;
    shirtGroups.forEach(s => {
      const selected = s === item;
      s.group.userData.targetScale = selected ? 1.04 : 0.91;
      s.group.userData.targetY = s.group.userData.baseY + (selected ? 0.08 : -0.035);
    });
    window.dispatchEvent(new CustomEvent('aarv:select', { detail: { id: item.id } }));
  }

  renderer.domElement.addEventListener('pointerdown', event => {
    const found = pick(event); if (!found) return;
    downGroup = found; dragging = true; moved = false; lastX = event.clientX; lastMoveTime = performance.now();
    found.group.userData.dragVelocity = 0;
    renderer.domElement.setPointerCapture(event.pointerId);
    renderer.domElement.style.cursor = 'grabbing';
  });
  renderer.domElement.addEventListener('pointermove', event => {
    if (!dragging) { renderer.domElement.style.cursor = pick(event) ? 'grab' : 'default'; return; }
    const dx = event.clientX - lastX;
    if (Math.abs(dx) > 1.2) moved = true;
    if (downGroup) {
      const dt = Math.max(8, performance.now() - lastMoveTime);
      const delta = dx * 0.012;
      downGroup.group.rotation.y += delta;
      downGroup.group.userData.dragVelocity = delta / dt * 16;
    }
    lastX = event.clientX; lastMoveTime = performance.now();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; renderer.domElement.style.cursor = 'grab';
    if (downGroup && !moved) selectShirt(downGroup);
    else if (downGroup) active = downGroup;
    downGroup = null;
  }
  renderer.domElement.addEventListener('pointerup', endDrag);
  renderer.domElement.addEventListener('pointercancel', endDrag);
  renderer.domElement.addEventListener('lostpointercapture', endDrag);
  renderer.domElement.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const item = active || shirtGroups[0]; if (!item) return;
    item.group.rotation.y += event.key === 'ArrowLeft' ? 0.22 : -0.22;
    event.preventDefault();
  });
  renderer.domElement.tabIndex = 0;

  // Keep the rack composition balanced on desktop and mobile.
  function resize() {
    const width = root.clientWidth || 900, height = root.clientHeight || 460;
    const compact = width < 700;
    const gap = compact ? 1.72 : 2.42;
    shirtGroups.forEach((s, i) => {
      s.group.position.x = (i - 1.5) * gap;
      s.group.scale.setScalar(compact ? 0.72 : 1);
      s.group.userData.baseX = s.group.position.x;
    });
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = compact ? 13.9 : 12.8;
    camera.fov = compact ? 37 : 34;
    camera.updateProjectionMatrix();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(root);
  else window.addEventListener('resize', resize);
  resize();

  window.addEventListener('aarv:select', event => {
    const item = shirtGroups.find(s => s.id === event.detail?.id);
    if (item && item !== active) selectShirt(item);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    shirtGroups.forEach((s, i) => {
      const g = s.group;
      if (!dragging || downGroup !== s) {
        if (Math.abs(g.userData.dragVelocity) > 0.0005) {
          g.rotation.y += g.userData.dragVelocity;
          g.userData.dragVelocity *= 0.91;
        } else if (s !== active) {
          g.rotation.y += (Math.sin(elapsed * 0.28 + i * 0.6) * 0.025 - g.rotation.y) * 0.012;
        }
      }
      const targetY = g.userData.targetY ?? g.userData.baseY;
      const targetScale = g.userData.targetScale ?? 1;
      g.position.y += (targetY + Math.sin(elapsed * 0.75 + i * 0.7) * 0.012 - g.position.y) * 0.035;
      const desired = (window.innerWidth < 700 ? 0.72 : 1) * targetScale;
      const current = g.scale.x;
      const next = current + (desired - current) * 0.045;
      g.scale.setScalar(next);
    });
    renderer.render(scene, camera);
  }
  animate();
  root.classList.add('rack-3d-ready');
}
