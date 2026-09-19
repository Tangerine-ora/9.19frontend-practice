/* ============================================================
 * 校园三维导览
 * 复用课堂七 Three.js 模式：场景 + 相机 + 渲染器 + 光照 + 动画
 * ============================================================ */

/* ---------- 场景与雾 ---------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3ff);          // 天空蓝
scene.fog = new THREE.Fog(0xbfe3ff, 25, 60);

/* ---------- 相机 ---------- */
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(14, 10, 16);
camera.lookAt(0, 0, 0);

/* ---------- 渲染器：挂到已有 canvas ---------- */
const canvas = document.querySelector('#scene-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/* ---------- 鼠标交互：拖拽环绕 / 缩放 / 平移 ---------- */
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 1, 0);
controls.maxPolarAngle = Math.PI / 2 - 0.05;   // 不让视角钻到地面以下
controls.minDistance = 6;
controls.maxDistance = 45;

/* ---------- 光照：环境光 + 方向光 ---------- */
scene.add(new THREE.AmbientLight(0xffffff, 0.55));

const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(12, 20, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -25;
sun.shadow.camera.right = 25;
sun.shadow.camera.top = 25;
sun.shadow.camera.bottom = -25;
sun.shadow.camera.far = 60;
scene.add(sun);

/* ---------- 草地（地面） ---------- */
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.MeshStandardMaterial({ color: 0x6ab04c })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

/* ---------- 校园中央道路 ---------- */
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 60),
  new THREE.MeshStandardMaterial({ color: 0x9e9e9e })
);
road.rotation.x = -Math.PI / 2;
road.position.y = 0.01;
road.receiveShadow = true;
scene.add(road);

/* ---------- 工具函数：建一栋楼（墙体 + 屋顶 + 门窗） ---------- */
const buildBuilding = (w, h, d, wallColor, roofColor) => {
  const group = new THREE.Group();

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color: wallColor })
  );
  wall.position.y = h / 2;
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);

  // 坡屋顶
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(Math.max(w, d) * 0.75, 1.2, 4),
    new THREE.MeshStandardMaterial({ color: roofColor })
  );
  roof.rotation.y = Math.PI / 4;
  roof.position.y = h + 0.6;
  roof.castShadow = true;
  group.add(roof);

  // 正面窗户（自发光小方块，夜里也看得见）
  const winMat = new THREE.MeshStandardMaterial({
    color: 0xfff59d,
    emissive: 0xffe082,
    emissiveIntensity: 0.5
  });
  const cols = Math.max(2, Math.floor(w / 1.4));
  const rows = Math.max(1, Math.floor(h / 1.4));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.05), winMat);
      win.position.set(
        -w / 2 + (c + 1) * (w / (cols + 1)),
        1 + r * 1.3,
        d / 2 + 0.03
      );
      group.add(win);
    }
  }
  return group;
};

/* ---------- 地标一：教学楼 ---------- */
const teaching = buildBuilding(6, 4, 4, 0xefeeee, 0xb71c1c);
teaching.position.set(-8, 0, -6);
scene.add(teaching);

/* ---------- 地标二：图书馆（更高） ---------- */
const library = buildBuilding(7, 6, 5, 0xe3f2fd, 0x0d47a1);
library.position.set(8, 0, -8);
scene.add(library);

/* ---------- 地标三：厚德书院 ---------- */
const college = buildBuilding(5, 3.5, 4, 0xf3e5f5, 0x6a1b9a);
college.position.set(-9, 0, 7);
scene.add(college);

/* ---------- 地标四：旗杆 + 红旗（旗帜飘动动画） ---------- */
const pole = new THREE.Mesh(
  new THREE.CylinderGeometry(0.08, 0.08, 7, 16),
  new THREE.MeshStandardMaterial({ color: 0x9e9e9e })
);
pole.position.set(0, 3.5, 4);
pole.castShadow = true;
scene.add(pole);

// 旗帜：用多段平面，动画时按正弦波摆动
const flagGeo = new THREE.PlaneGeometry(2.4, 1.4, 12, 4);
const flag = new THREE.Mesh(
  flagGeo,
  new THREE.MeshStandardMaterial({ color: 0xe53935, side: THREE.DoubleSide })
);
flag.position.set(1.25, 6, 4);
scene.add(flag);

/* ---------- 地标五：日晷/雕塑台（圆柱+球） ---------- */
const sculpture = new THREE.Group();
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(1.2, 1.4, 0.4, 32),
  new THREE.MeshStandardMaterial({ color: 0x78909c })
);
base.position.y = 0.2;
base.castShadow = true;
base.receiveShadow = true;
sculpture.add(base);
const globe = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x4fc3f7,
    metalness: 0.3,
    roughness: 0.3
  })
);
globe.position.y = 1.2;
globe.castShadow = true;
sculpture.add(globe);
sculpture.position.set(9, 0, 7);
scene.add(sculpture);

/* ---------- 周边树木：圆柱树干 + 球冠 ---------- */
const treePositions = [
  [-5, -2], [-13, -2], [5, -3], [13, -1],
  [-5, 12], [-13, 12], [5, 13], [13, 12], [0, -14]
];
treePositions.forEach(([x, z]) => {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 1.4, 10),
    new THREE.MeshStandardMaterial({ color: 0x795548 })
  );
  trunk.position.y = 0.7;
  trunk.castShadow = true;
  tree.add(trunk);
  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x2e7d32 })
  );
  crown.position.y = 1.9;
  crown.castShadow = true;
  tree.add(crown);
  tree.position.set(x, 0, z);
  scene.add(tree);
});

/* ---------- 动画循环 ---------- */
const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // 旗帜飘动：逐顶点按正弦波偏移
  const pos = flagGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, Math.sin(x * 3 + t * 4) * 0.12 * (x + 1.2) / 2.4);
  }
  pos.needsUpdate = true;

  // 雕塑球体自转
  globe.rotation.y += 0.008;

  controls.update();
  renderer.render(scene, camera);
};
animate();

/* ---------- 窗口适配：相机 + 渲染器都要更新 ---------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
