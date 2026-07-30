import * as THREE from 'three';

function createSky() {
  const geometry = new THREE.SphereGeometry(45, 24, 16);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color(0x54788b) },
      horizonColor: { value: new THREE.Color(0xc6b994) },
      bottomColor: { value: new THREE.Color(0x8e8069) },
    },
    vertexShader: `
      varying vec3 worldPosition;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        worldPosition = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      varying vec3 worldPosition;
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 bottomColor;
      void main() {
        float height = normalize(worldPosition).y;
        vec3 low = mix(bottomColor, horizonColor, smoothstep(-0.15, 0.08, height));
        vec3 color = mix(low, topColor, smoothstep(0.05, 0.8, height));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  return new THREE.Mesh(geometry, material);
}

function createDust() {
  const points: number[] = [];
  for (let index = 0; index < 240; index += 1) {
    points.push(
      Math.random() * 25,
      .25 + Math.random() * 3.2,
      Math.random() * 15,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xe7d7ae,
      size: .025,
      transparent: true,
      opacity: .32,
      depthWrite: false,
    }),
  );
}

export function addShooterAtmosphere(scene: THREE.Scene) {
  scene.add(createSky(), createDust());
  scene.add(new THREE.HemisphereLight(0xcbe3ee, 0x5a4c36, 1.8));

  const sun = new THREE.DirectionalLight(0xffe2ae, 3.2);
  sun.position.set(7, 14, -5);
  sun.target.position.set(12, 0, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 14;
  sun.shadow.camera.bottom = -14;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 35;
  sun.shadow.bias = -.0003;
  scene.add(sun, sun.target);
}
