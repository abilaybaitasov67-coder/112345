import bpy
from pathlib import Path


def material(name: str, color: tuple[float, float, float, float]):
    result = bpy.data.materials.new(name)
    result.diffuse_color = color
    result.roughness = 0.78
    return result


def cube(name: str, scale: tuple[float, float, float], location, paint):
    bpy.ops.mesh.primitive_cube_add(location=location)
    item = bpy.context.object
    item.name = name
    item.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    item.data.materials.append(paint)
    bevel = item.modifiers.new("Soft edges", "BEVEL")
    bevel.width = 0.025
    bevel.segments = 2
    return item


bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

wood = material("Desert wood", (0.34, 0.22, 0.11, 1))
metal = material("Dark steel", (0.07, 0.09, 0.08, 1))
paint = material("Team marking", (0.75, 0.36, 0.08, 1))

cube("Crate", (0.72, 0.72, 0.72), (0, 0, 0.72), wood)
for z in (0.08, 1.36):
    cube("Steel band", (0.76, 0.035, 0.055), (0, -0.75, z), metal)
    cube("Steel band", (0.035, 0.76, 0.055), (0.75, 0, z), metal)
for x in (-0.58, 0.58):
    cube("Front brace", (0.055, 0.035, 0.64), (x, -0.755, 0.72), metal)

mark = cube("Orange marking", (0.22, 0.018, 0.22), (0, -0.79, 0.72), paint)
mark.rotation_euler[1] = 0.785

output = Path(__file__).resolve().parents[2] / "public" / "models"
output.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=str(output / "tactical-crate.glb"),
    export_format="GLB",
    use_selection=False,
)
