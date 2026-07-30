import * as THREE from 'three';
import { ShooterWorld, WeaponId } from './shooterTypes';
import { SHOOTER_HEIGHT, SHOOTER_WIDTH } from './shooterWorld';
import { weaponInfo } from './shooterWeapons';
import { syncBulletMeshes, syncDroppedWeapons } from './shooter3dEffects';
import { buildTacticalMap } from './shooter3dMap';
import { loadBlenderWeapon } from './shooter3dWeaponLoader';
import { addShooterAtmosphere } from './shooter3dAtmosphere';
import { createBombModel, syncBombModel } from './shooter3dBomb';
import { getShooterFloorHeight } from './shooterFloorHeight';
import { syncEnemyModels, syncRemotePlayerModels } from './shooter3dPlayers';

const SCALE = .025;

export class Shooter3dRenderer {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(68, SHOOTER_WIDTH / SHOOTER_HEIGHT, .05, 80);
  private enemies: THREE.Group[] = [];
  private remotePlayers = new Map<string, THREE.Group>();
  private weapon: THREE.Group | null = null;
  private weaponId: WeaponId | null = null;
  private weaponRequest = 0;
  private bulletMeshes: THREE.Mesh[] = [];
  private droppedWeapons: THREE.Group[] = [];
  private bombModel = createBombModel();
  private muzzleFlash = new THREE.Mesh(
    new THREE.SphereGeometry(.11, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xffd45c }),
  );
  private clock = new THREE.Clock();

  constructor(canvas: HTMLCanvasElement, world: ShooterWorld) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setSize(SHOOTER_WIDTH, SHOOTER_HEIGHT, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.fog = new THREE.FogExp2(0xc4a77a, .012);
    addShooterAtmosphere(this.scene);
    buildTacticalMap(this.scene, world);
    this.scene.add(this.bombModel);
    this.muzzleFlash.position.set(.05, -.2, -1.8);
    this.muzzleFlash.visible = false;
    this.camera.add(this.muzzleFlash);
    this.scene.add(this.camera);
  }

  private syncWeapon(world: ShooterWorld) {
    if (this.weaponId === world.weapon) return;
    if (this.weapon) this.camera.remove(this.weapon);
    this.weaponId = world.weapon;
    this.weapon = null;
    const requestedWeapon = world.weapon;
    const request = ++this.weaponRequest;
    if (!requestedWeapon) return;
    void loadBlenderWeapon(requestedWeapon).then((model) => {
      if (request !== this.weaponRequest) return;
      this.weapon = model;
      const hasHands = requestedWeapon === 'rifle';
      const weaponY = requestedWeapon === 'sniper' ? -.32 : -.36;
      const weaponScale = requestedWeapon === 'sniper' ? .66 : hasHands ? .52 : .62;
      model.scale.setScalar(weaponScale);
      model.position.set(
        hasHands ? .36 : .5,
        hasHands ? -.08 : weaponY,
        hasHands ? -1.08 : -.9,
      );
      model.rotation.set(-.04, Math.PI - .18, 0);
      this.camera.add(model);
    });
  }

  render(world: ShooterWorld) {
    const floorHeight = getShooterFloorHeight(world.player.x, world.player.y);
    this.camera.position.set(
      world.player.x * SCALE,
      1.7 + floorHeight,
      world.player.y * SCALE,
    );
    const pitch = world.pitch / 430;
    this.camera.lookAt(
      this.camera.position.x + Math.cos(world.angle),
      1.7 + floorHeight + pitch,
      this.camera.position.z + Math.sin(world.angle),
    );
    this.camera.fov = world.aiming ? 24 : 68;
    this.camera.updateProjectionMatrix();
    syncEnemyModels(this.scene, this.enemies, world, SCALE);
    syncRemotePlayerModels(this.scene, this.remotePlayers, world, SCALE);
    this.syncWeapon(world);
    syncBulletMeshes(this.scene, this.bulletMeshes, world, SCALE);
    syncDroppedWeapons(this.scene, this.droppedWeapons, world, SCALE);
    syncBombModel(this.bombModel, world, SCALE, this.clock.getElapsedTime());
    if (this.weapon) this.weapon.visible = !world.aiming;
    if (this.weapon && !world.aiming) {
      const time = this.clock.getElapsedTime();
      const recoil = world.player.cooldown > 0
        ? Math.min(.13, world.player.cooldown / 1100)
        : 0;
      const weaponY = this.weaponId === 'sniper' ? -.32 : -.36;
      this.weapon.position.set(
        .5 + Math.sin(time * 1.7) * .008,
        weaponY + Math.sin(time * 3.4) * .006 - recoil * .25,
        -.9 + recoil,
      );
      this.weapon.rotation.x = -.04 - recoil * 1.6;
      this.weapon.rotation.y = Math.PI - .18;
    }
    const flashTime = world.weapon && world.weapon !== 'knife'
      ? weaponInfo[world.weapon].cooldown - 65
      : Number.POSITIVE_INFINITY;
    this.muzzleFlash.visible = !world.aiming && world.player.cooldown > flashTime;
    if (this.muzzleFlash.visible) {
      const pulse = .8 + Math.random() * .7;
      this.muzzleFlash.scale.set(pulse, pulse, pulse * 1.7);
    }
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.dispose();
  }
}
