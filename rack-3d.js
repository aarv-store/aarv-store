/* AЯRV 3D Archive Rack — interactive hanger display. Uses Three.js from jsDelivr. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const root = document.getElementById('rack3d');
if (root) {
  const products = [
    { id:'archive-001', front:'img/archive-001-front-3d.png', back:'img/archive-001-back-3d.png' },
    { id:'archive-002', front:'img/archive-002-front-3d.png', back:'img/archive-002-back-3d.png' },
    { id:'archive-003', front:'img/archive-003-front-3d.png', back:'img/archive-003-back-3d.png' },
    { id:'archive-004', front:'img/archive-004-front-3d.png', back:'img/archive-004-back-3d.png' }
  ];
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.2, 10.8);
  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.domElement.setAttribute('aria-label','Rak kaos 3D AЯRV. Seret kaos untuk memutar 360 derajat.');
  root.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xe5e8df, 0x242522, 2.0));
  const key = new THREE.DirectionalLight(0xffe4bd, 3.2); key.position.set(-3,5,7); scene.add(key);
  const fill = new THREE.DirectionalLight(0xc4d4e0, 2.0); fill.position.set(5,2,-5); scene.add(fill);
  const rim = new THREE.PointLight(0xc89b62, 24, 18); rim.position.set(-4,1,3); scene.add(rim);

  const metal = new THREE.MeshStandardMaterial({color:0x858b83,metalness:.86,roughness:.25});
  const darkMetal = new THREE.MeshStandardMaterial({color:0x343a35,metalness:.8,roughness:.3});
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,8.1,24), metal);
  rail.rotation.z = Math.PI/2; rail.position.set(0,2.05,0); scene.add(rail);
  [-3.85,3.85].forEach(x=>{
    const support = new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.8,12),darkMetal);
    support.position.set(x,1.15,0); scene.add(support);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.12,16),metal); foot.position.set(x,.23,0); scene.add(foot);
  });

  const loader = new THREE.TextureLoader();
  const shirtGroups = [];
  const shirtShape = new THREE.Shape();
  shirtShape.moveTo(-.48,.88); shirtShape.lineTo(-.92,.72); shirtShape.lineTo(-1.27,.27);
  shirtShape.lineTo(-.99,-.04); shirtShape.lineTo(-.76,.22); shirtShape.lineTo(-.76,-.98);
  shirtShape.lineTo(.76,-.98); shirtShape.lineTo(.76,.22); shirtShape.lineTo(.99,-.04);
  shirtShape.lineTo(1.27,.27); shirtShape.lineTo(.92,.72); shirtShape.lineTo(.48,.88);
  shirtShape.quadraticCurveTo(.34,.68,0,.68); shirtShape.quadraticCurveTo(-.34,.68,-.48,.88);
  const shirtGeo = new THREE.ExtrudeGeometry(shirtShape,{depth:.11,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:12});
  shirtGeo.center();
  const cloth = new THREE.MeshStandardMaterial({color:0x090b0a,roughness:.9,metalness:0.02});
  const planeGeo = new THREE.PlaneGeometry(1.92,1.80);
  const hangerMat = new THREE.MeshStandardMaterial({color:0x171a18,roughness:.34,metalness:.7});

  function tube(points, radius, material, parent) {
    const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve,32,radius,8,false),material);
    parent.add(mesh); return mesh;
  }
  products.forEach((p,i)=>{
    const group = new THREE.Group();
    group.position.set((i-1.5)*2.05,.25,0);
    scene.add(group); shirtGroups.push({group,id:p.id,baseY:group.position.y});
    const body = new THREE.Mesh(shirtGeo,cloth); body.position.y=-.03; group.add(body);
    const frontTex = loader.load(p.front, t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();});
    const backTex = loader.load(p.back, t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();});
    const front = new THREE.Mesh(planeGeo,new THREE.MeshBasicMaterial({map:frontTex,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
    front.position.set(0,-.02,.105); group.add(front);
    const back = new THREE.Mesh(planeGeo,new THREE.MeshBasicMaterial({map:backTex,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
    back.position.set(0,-.02,-.105); back.rotation.y=Math.PI; group.add(back);
    // Neck opening and subtle ribbed collar.
    const collar = new THREE.Mesh(new THREE.TorusGeometry(.235,.055,10,48),new THREE.MeshStandardMaterial({color:0x202321,roughness:.95}));
    collar.position.set(0,.77,.14); collar.scale.set(1,.55,1); group.add(collar);
    // Broad hanger with curved shoulders and metal hook.
    tube([[-.88,1.05,.04],[-.55,1.18,.04],[0,1.30,.04],[.55,1.18,.04],[.88,1.05,.04]],.035,hangerMat,group);
    tube([[0,1.30,.04],[0,1.48,.04],[.02,1.62,.04],[.14,1.66,.04],[.2,1.58,.04]],.018,metal,group);
    group.userData.productId=p.id;
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let active = null, dragging = false, lastX = 0, moved = false, downGroup = null;
  function point(e){const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;}
  function pick(e){point(e);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(shirtGroups.map(x=>x.group),true);return hits.length?shirtGroups.find(x=>x.group===hits[0].object.parent||x.group===hits[0].object.parent?.parent||x.group===hits[0].object):null;}
  renderer.domElement.addEventListener('pointerdown',e=>{const found=pick(e);if(!found)return;active=found;downGroup=found;dragging=true;moved=false;lastX=e.clientX;renderer.domElement.setPointerCapture(e.pointerId);renderer.domElement.style.cursor='grabbing';});
  renderer.domElement.addEventListener('pointermove',e=>{if(!dragging){renderer.domElement.style.cursor=pick(e)?'grab':'default';return;}const dx=e.clientX-lastX;if(Math.abs(dx)>1)moved=true;active.group.rotation.y+=dx*.012;lastX=e.clientX;});
  function endDrag(){if(!dragging)return;dragging=false;renderer.domElement.style.cursor='grab';if(!moved&&downGroup){window.dispatchEvent(new CustomEvent('aarv:select',{detail:{id:downGroup.id}}));}downGroup=null;}
  renderer.domElement.addEventListener('pointerup',endDrag);renderer.domElement.addEventListener('pointercancel',endDrag);renderer.domElement.addEventListener('lostpointercapture',endDrag);
  renderer.domElement.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){const g=active||shirtGroups[0];g.group.rotation.y+=(e.key==='ArrowLeft'?.18:-.18);}});
  renderer.domElement.tabIndex=0;

  function resize(){const w=root.clientWidth||900,h=root.clientHeight||410;const compact=w<700;shirtGroups.forEach((s,i)=>{s.group.position.x=(i-1.5)*(compact?1.15:2.05);s.group.scale.setScalar(compact?.62:1);});renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=compact?9.4:10.8;camera.updateProjectionMatrix();}
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(root);else window.addEventListener('resize',resize);resize();
  const clock=new THREE.Clock();
  function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();shirtGroups.forEach((s,i)=>{if(s!==active&&!dragging){s.group.rotation.y+=(Math.sin(t*.42+i*.7)*.035-s.group.rotation.y)*.025;}s.group.position.y=s.baseY+Math.sin(t*.8+i*.8)*.025;});renderer.render(scene,camera);}
  animate();
  root.classList.add('rack-3d-ready');
}
