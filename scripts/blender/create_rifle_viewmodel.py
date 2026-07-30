import math
import os
import sys

import bpy
from mathutils import Matrix, Vector


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
ARMS_BLEND = os.path.join(
    ROOT, "scripts/blender/assets/wrad-arms/arms.blend"
)
RIFLE = os.path.join(ROOT, "public/models/weapons/rifle.glb")
OUTPUT = os.path.join(ROOT, "public/models/viewmodels/rifle-arms.glb")


def move_ik(name: str, target: tuple[float, float, float]) -> None:
    bone = bpy.data.objects["arms"].pose.bones[name]
    matrix = bone.matrix.copy()
    matrix.translation = Vector(target)
    bone.matrix = matrix


def curl_fingers(side: str) -> None:
    for finger in ("pinky", "ring", "middle", "index"):
        for joint, angle in enumerate((55, 72, 48), start=1):
            bone = bpy.data.objects["arms"].pose.bones[f"finger_{finger}{joint}.{side}"]
            bone.rotation_mode = "XYZ"
            bone.rotation_euler.x = math.radians(angle if side == "r" else -angle)
    for joint, angle in enumerate((28, 42, 28), start=1):
        bone = bpy.data.objects["arms"].pose.bones[f"finger_thumb{joint}.{side}"]
        bone.rotation_mode = "XYZ"
        bone.rotation_euler.z = math.radians(-angle if side == "r" else angle)


bpy.ops.wm.open_mainfile(filepath=ARMS_BLEND)
arms = bpy.data.objects["arms"]
mesh = bpy.data.objects["arms_mesh"]

move_ik("wrist_ik.r", (1.3, 4.5, -4.55))
move_ik("wrist_ik.l", (-3.7, 8.2, -3.35))
move_ik("arm_target.r", (2.7, -1.1, -2.1))
move_ik("arm_target.l", (-2.8, -0.7, -1.8))
curl_fingers("r")
curl_fingers("l")
bpy.context.view_layer.update()

arms.scale = (0.22, 0.22, 0.22)
arms.location = (0.18, -1.05, 0.44)

skin = bpy.data.materials.new("fps_gloves")
skin.diffuse_color = (0.32, 0.13, 0.07, 1)
skin.use_nodes = True
skin.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (
    0.32, 0.13, 0.07, 1
)
mesh.data.materials.clear()
mesh.data.materials.append(skin)

depsgraph = bpy.context.evaluated_depsgraph_get()
posed_mesh = bpy.data.meshes.new_from_object(
    mesh.evaluated_get(depsgraph), depsgraph=depsgraph
)
posed_mesh.transform(mesh.matrix_world)
posed_mesh.transform(
    Matrix.Translation((0, 0, 0.16))
    @ Matrix.Rotation(math.pi, 4, "Y")
)
posed_arms = bpy.data.objects.new("posed_fps_arms", posed_mesh)
bpy.context.scene.collection.objects.link(posed_arms)
posed_arms.matrix_world = Matrix.Identity(4)

bpy.ops.import_scene.gltf(filepath=RIFLE)
gun = next(obj for obj in bpy.context.selected_objects if obj.type == "MESH")
gun.rotation_euler = (0, 0, 0)
gun.location = (0, 0, 0)

camera = bpy.data.objects.get("Camera")
if camera:
    bpy.data.objects.remove(camera, do_unlink=True)

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
bpy.ops.object.select_all(action="DESELECT")
posed_arms.select_set(True)
bpy.context.view_layer.objects.active = posed_arms
bpy.ops.export_scene.gltf(
    filepath=OUTPUT,
    export_format="GLB",
    use_selection=True,
    export_apply=False,
    export_animations=False,
)
print(f"Exported {OUTPUT}")
