import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WeaponId } from './shooterTypes';
import { createBlockArms } from './shooter3dBlockArms';

const loader = new GLTFLoader();
const cache = new Map<WeaponId, THREE.Group>();

function loadScene(path: string) {
  return new Promise<THREE.Group>((resolve, reject) => {
    loader.load(path, ({ scene }) => {
      scene.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
      resolve(scene);
    }, undefined, reject);
  });
}

export async function loadBlenderWeapon(id: WeaponId) {
  const path = `${import.meta.env.BASE_URL}models/weapons/${id}.glb`;
  const weapon = cache.get(id) ?? await loadScene(path);
  cache.set(id, weapon);
  const viewModel = new THREE.Group();
  const isSidearm = id === 'pistol' || id === 'revolver' || id === 'knife';
  const weaponModel = weapon.clone(true);
  weaponModel.scale.setScalar(isSidearm ? .58 : .76);
  viewModel.add(weaponModel);
  viewModel.add(createBlockArms(id));
  return viewModel;
}
