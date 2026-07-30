import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

function loadTexture(file: string, repeatX: number, repeatY: number) {
  const texture = textureLoader.load(
    `${import.meta.env.BASE_URL}textures/${file}`,
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export const dustPlasterMaterial = new THREE.MeshStandardMaterial({
  map: loadTexture('dust-plaster.jpg', 2.6, 2.2),
  roughness: .96,
});

export const dustStoneMaterial = new THREE.MeshStandardMaterial({
  map: loadTexture('dust-stone.jpg', 2.4, 2.1),
  roughness: .98,
});

export const dustWoodMaterial = new THREE.MeshStandardMaterial({
  map: loadTexture('dust-wood.jpg', 1.5, 1.5),
  roughness: .9,
});

export const dustRoofMaterial = new THREE.MeshStandardMaterial({
  map: loadTexture('dust-wood.jpg', 4.5, 3.2),
  color: 0x9a8069,
  roughness: .94,
});

export const dustGroundMaterial = new THREE.MeshStandardMaterial({
  map: loadTexture('dust-plaster.jpg', 18, 15),
  color: 0xc7a87b,
  roughness: 1,
});

export const dustTrimMaterial = new THREE.MeshStandardMaterial({
  map: loadTexture('dust-stone.jpg', 5, 1),
  color: 0xb49a78,
  roughness: .98,
});
