import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WeaponId } from './shooterTypes';
import { createBlockArms } from './shooter3dBlockArms';
import { createWeaponModel } from './shooter3dModels';

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
  const weapon = id === 'm4a1'
    ? createWeaponModel(id, false)
    : await getWeapon(id, path);
  const viewModel = new THREE.Group();
  const isSidearm = id === 'pistol' || id === 'revolver' || id === 'knife';
  const weaponModel = weapon.clone(true);
  weaponModel.scale.setScalar(isSidearm ? .58 : .76);
  viewModel.add(weaponModel);
  viewModel.add(createBlockArms(id));
  return viewModel;
}
