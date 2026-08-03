import * as THREE from 'three';

function createDust(lowPower: boolean) {
  const points: number[] = [];
  const particleCount = lowPower ? 60 : 240;
  for (let index = 0; index < particleCount; index += 1) {
    points.push(
      Math.random() * 48,
      .25 + Math.random() * 3.2,
      Math.random() * 40,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xf0dab0,
      size: .025,
      transparent: true,
      opacity: .32,
      depthWrite: false,
    }),
  );
}

function createSoftTexture(colors: [string, string]) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.CanvasTexture(canvas);
  const gradient = context.createRadialGradient(128, 64, 5, 128, 64, 120);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

function createSun() {
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({
    map: createSoftTexture(['rgba(255,246,190,1)', 'rgba(255,210,110,0)']),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));
  sun.position.set(42, 30, -35);
  sun.scale.set(14, 7, 1);
  return sun;
}

function createClouds() {
  const texture = createSoftTexture(['rgba(255,255,255,.8)', 'rgba(255,255,255,0)']);
  const clouds = new THREE.Group();
  const positions = [
    [10, 19, 5, 15], [35, 23, 9, 20], [5, 25, 33, 18],
    [44, 20, 27, 14], [22, 27, 44, 19],
  ];
  positions.forEach(([x, y, z, size], index) => {
    const cloud = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      color: index % 2 ? 0xe8f4fa : 0xffffff,
      transparent: true,
      opacity: .5,
      depthWrite: false,
    }));
    cloud.position.set(x, y, z);
    cloud.scale.set(size, size * .32, 1);
    clouds.add(cloud);
  });
  return clouds;
}

export function addShooterAtmosphere(scene: THREE.Scene, lowPower = false) {
  scene.background = new THREE.Color(0x72b8e8);
  scene.add(createDust(lowPower));
  if (!lowPower) scene.add(createSun(), createClouds());
  scene.add(new THREE.HemisphereLight(0xd9ebf0, 0x70533c, 1.8));

  const sun = new THREE.DirectionalLight(0xffdc9c, 3.2);
  sun.position.set(7, 14, -5);
  sun.target.position.set(24, 0, 20);
  sun.castShadow = !lowPower;
  sun.shadow.mapSize.set(lowPower ? 512 : 2048, lowPower ? 512 : 2048);
  sun.shadow.camera.left = -25;
  sun.shadow.camera.right = 25;
  sun.shadow.camera.top = 30;
  sun.shadow.camera.bottom = -30;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 35;
  sun.shadow.bias = -.0003;
  scene.add(sun, sun.target);
}
