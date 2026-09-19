/* ============================================================
 * 沙星三维沙盘：双子太阳 / 红岩台地 / PLANT营养罐 / Punisher
 * 复用课堂七 Three.js 模式：场景+相机+渲染器+光照+动画
 * ============================================================ */

/* ---------- 场景与雾（沙尘氛围） ---------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2c98a);
scene.fog = new THREE.Fog(0xf2c98a, 30, 90);

/* ---------- 相机 ---------- */
const camera = new THREE.PerspectiveCamera(
  50, window.innerWidth / window.innerHeight, 0.1, 300
);
camera.position.set(16, 12, 18);
camera.lookAt(0, 2, 0);

/* ---------- 渲染器 ---------- */
const canvas = document.querySelector('#scene-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/* ---------- 轨道控制 ---------- */
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 2, 0);
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.minDistance = 8;
controls.maxDistance = 60;

/* ---------- 双子太阳（Trigun 沙星有两颗太阳） ---------- */
const sunA = new THREE.Mesh(
  new THREE.SphereGeometry(3, 24, 24),
  new THREE.MeshBasicMaterial({ color: 0xffe9a8 })
);
sunA.position.set(-30, 26, -50);
scene.add(sunA);

const sunB = new THREE.Mesh(
  new THREE.SphereGeometry(2, 24, 24),
  new THREE.MeshBasicMaterial({ color: 0xffb56b })
);
sunB.position.set(-16, 32, -58);
scene.add(sunB);

/* ---------- 光照 ---------- */
scene.add(new THREE.AmbientLight(0xffe0b3, 0.6));

const sun = new THREE.DirectionalLight(0xffd9a0, 1.0);
sun.position.set(-24, 28, -18);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -30;
sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30;
sun.shadow.camera.bottom = -30;
sun.shadow.camera.far = 90;
scene.add(sun);

/* ---------- 沙漠地面（起伏感用两层错位圆盘） ---------- */
const desert = new THREE.Mesh(
  new THREE.CircleGeometry(80, 48),
  new THREE.MeshStandardMaterial({ color: 0xdcae6e, roughness: 1 })
);
desert.rotation.x = -Math.PI / 2;
desert.receiveShadow = true;
scene.add(desert);

/* ---------- 红岩台地（mesa：圆柱叠台） ---------- */
const mesaSpots = [[-14, -8], [12, -12], [-9, 14], [16, 10], [0, -18]];
mesaSpots.forEach(([x, z], i) => {
  const h = 3 + (i % 3) * 1.6;
  const mesa = new THREE.Group();
  const lower = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 3.2, h, 8),
    new THREE.MeshStandardMaterial({ color: 0xb5602e, flatShading: true })
  );
  lower.position.y = h / 2;
  lower.castShadow = true;
  lower.receiveShadow = true;
  mesa.add(lower);
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(3.0, 2.6, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: 0xc88a3c, flatShading: true })
  );
  cap.position.y = h + 0.25;
  cap.castShadow = true;
  mesa.add(cap);
  mesa.position.set(x, 0, z);
  scene.add(mesa);
});

/* ---------- PLANT 营养罐（透明罐+发光球，能源核心） ---------- */
const plants = [];
const plantSpots = [[-5, -4], [6, -5], [-7, 6]];
plantSpots.forEach(([x, z]) => {
  const tank = new THREE.Group();
  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 2.6, 20),
    new THREE.MeshStandardMaterial({
      color: 0xbfe8ff, transparent: true, opacity: 0.35, roughness: 0.1
    })
  );
  glass.position.y = 1.3;
  tank.add(glass);
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 20, 20),
    new THREE.MeshStandardMaterial({
      color: 0x7fe3ff, emissive: 0x40c4ff, emissiveIntensity: 0.9
    })
  );
  core.position.y = 1.3;
  tank.add(core);
  const baseRing = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.2, 0.3, 20),
    new THREE.MeshStandardMaterial({ color: 0x6f7b8a })
  );
  baseRing.position.y = 0.15;
  baseRing.castShadow = true;
  tank.add(baseRing);
  tank.position.set(x, 0, z);
  scene.add(tank);
  plants.push(core);
});

/* ---------- Punisher 十字架（Wolfwood 的武器，斜立于台地旁） ---------- */
const punisher = new THREE.Group();
const crossMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.4, roughness: 0.5 });
const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5.2, 0.5), crossMat);
vBar.position.y = 2.6;
vBar.castShadow = true;
punisher.add(vBar);
const hBar = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 0.5), crossMat);
hBar.position.y = 3.8;
hBar.castShadow = true;
punisher.add(hBar);
punisher.position.set(9, 0, 3);
punisher.rotation.z = 0.12;
scene.add(punisher);

/* ---------- 边境小镇（风车 + 木屋群） ---------- */
const town = new THREE.Group();
const woodMat = new THREE.MeshStandardMaterial({ color: 0x9c6b3f });
[[-1.2, 0], [0.8, 0.6], [1.8, -0.8], [-0.2, 1.6]].forEach(([x, z]) => {
  const hut = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 1.2), woodMat);
  hut.position.set(x, 0.6, z);
  hut.castShadow = true;
  town.add(hut);
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.1, 0.7, 4),
    new THREE.MeshStandardMaterial({ color: 0x7a4a26 })
  );
  roof.rotation.y = Math.PI / 4;
  roof.position.set(x, 1.55, z);
  roof.castShadow = true;
  town.add(roof);
});

// 风车（杆+叶片，动画旋转）
const millPole = new THREE.Mesh(
  new THREE.CylinderGeometry(0.08, 0.1, 2.6, 8),
  new THREE.MeshStandardMaterial({ color: 0x8a6a4a })
);
millPole.position.set(-2.6, 1.3, 0.4);
millPole.castShadow = true;
town.add(millPole);
const blades = new THREE.Group();
for (let i = 0; i < 4; i++) {
  const blade = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.1, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xd9c49a })
  );
  blade.position.y = 0.55;
  const arm = new THREE.Group();
  arm.add(blade);
  arm.rotation.z = (Math.PI / 2) * i;
  blades.add(arm);
}
blades.position.set(-2.6, 2.5, 0.45);
town.add(blades);
town.position.set(4, 0, -2);
scene.add(town);

/* ---------- 枯树点缀 ---------- */
[[-11, 2], [10, -6], [-3, -11]].forEach(([x, z]) => {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.14, 1.6, 6),
    new THREE.MeshStandardMaterial({ color: 0x6e4a2c })
  );
  trunk.position.set(x, 0.8, z);
  trunk.castShadow = true;
  scene.add(trunk);
});

/* ---------- 动画循环 ---------- */
const clock = new THREE.Clock();
const animate = () => {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // PLANT 能量核心呼吸发光
  plants.forEach((core, i) => {
    core.material.emissiveIntensity = 0.7 + Math.sin(t * 2.2 + i) * 0.35;
    core.position.y = 1.3 + Math.sin(t * 1.4 + i) * 0.12;
  });

  // 风车叶片旋转
  blades.rotation.z += 0.02;

  // 双子太阳缓慢互绕
  sunB.position.x = -16 + Math.sin(t * 0.15) * 4;

  controls.update();
  renderer.render(scene, camera);
};
animate();

/* ---------- 窗口适配 ---------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
