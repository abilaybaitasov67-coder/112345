import bpy
import os
from pathlib import Path
from math import radians
from mathutils import Vector

# Source: Ultimate Gun Pack by Quaternius (CC0).
# https://opengameart.org/content/low-poly-guns-pack
SOURCE = Path(os.environ["WEAPON_PACK_OBJ_DIR"])
OUTPUT = Path(__file__).resolve().parents[2] / "public" / "models" / "weapons"
MODELS = {
    "knife": ("Accessories/Bayonet_2.obj", 1.1),
    "pistol": ("Pistol_5.obj", 1.15),
    "revolver": ("Revolver_4.obj", 1.2),
    "smg": ("SubmachineGun_3.obj", 1.7),
    "rifle": ("AssaultRifle_3.obj", 2.15),
    "shotgun": ("Shotgun_3.obj", 2.15),
    "sniper": ("SniperRifle_3.obj", 2.4),
}

def normalize_weapon(objects, target_length):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
    bounds = [
        obj.matrix_world @ Vector(corner)
        for obj in objects
        for corner in obj.bound_box
    ]
    low = Vector(map(min, zip(*bounds)))
    high = Vector(map(max, zip(*bounds)))
    center = (low + high) / 2
    scale = target_length / max(high.x - low.x, high.y - low.y, high.z - low.z)
    for obj in objects:
        obj.location -= center
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)
    for obj in objects:
        obj.scale *= scale
        obj.rotation_euler[2] = radians(-90)


def convert(weapon_id, relative_path, target_length):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    bpy.ops.wm.obj_import(filepath=str(SOURCE / relative_path))
    weapons = list(bpy.context.selected_objects)
    normalize_weapon(weapons, target_length)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT / f"{weapon_id}.glb"),
        export_format="GLB",
        use_selection=True,
    )


OUTPUT.mkdir(parents=True, exist_ok=True)
for model_id, (path, length) in MODELS.items():
    convert(model_id, path, length)
