import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WeaponId } from './shooterTypes';
import { createBlockArms } from './shooter3dBlockArms';

const loader = new GLTFLoader();
const cache = new Map<WeaponId, THREE.Group>();
const pendingLoads = new Map<WeaponId, Promise<THREE.Group>>();

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

async function getWeapon(id: WeaponId, path: string) {
  const cached = cache.get(id);
  if (cached) return cached;

  const pending = pendingLoads.get(id) ?? loadScene(path);
  pendingLoads.set(id, pending);
  try {
    const weapon = await pending;
    cache.set(id, weapon);
    return weapon;
  } finally {
    pendingLoads.delete(id);
  }
}

export async function loadBlenderWeapon(id: WeaponId) {
  const sourceId = id === 'ak47' ? 'rifle' : id;
  const path = `${import.meta.env.BASE_URL}models/weapons/${sourceId}.glb`;
  const weapon = await getWeapon(id, path);
  const viewModel = new THREE.Group();
  const isSidearm = id === 'pistol' || id === 'revolver' || id === 'knife';
  const weaponModel = weapon.clone(true);
  weaponModel.scale.setScalar(id === 'm4a4' ? .18 : isSidearm ? .58 : .76);
  if (id === 'm4a4') {
    weaponModel.rotation.y = Math.PI / 2;
    weaponModel.position.z = -.9;
  }
  viewModel.add(weaponModel);
  viewModel.add(createBlockArms(id));
  return viewModel;
}
