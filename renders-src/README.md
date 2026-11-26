# Hero renders (ThreeRT)

Photoreal rooms for the home hero, path-traced offline with [ThreeRT](https://github.com/meshy-dev/ThreeRT) (MIT, commit 07a9c29) and shipped as images. The ThreeRT engine is **not** part of the website.

| Scene | Output | Settings |
|---|---|---|
| `kaasth-heirloom.ts` | `public/renders/room-heirloom.jpg` | 2560×1440, 32 spp, 2×2 tiles |
| `kaasth-form.ts` | `public/renders/room-form.jpg` | 2560×1440, 32 spp, 2×2 tiles |
| `kaasth-heirloom-portrait.ts` | `public/renders/room-heirloom-portrait.jpg` | 1290×1720, 32 spp, 1×2 tiles (phones) |
| `kaasth-form-portrait.ts` | `public/renders/room-form-portrait.jpg` | 1290×1720, 32 spp, 1×2 tiles (phones) |

## Why tiles
The software GPU used here caps one storage buffer at 128 MB, which limits a single render to about 1.67 megapixels.
`threert-tile.patch` adds an off-axis "lens shift" to the renderer (env `THREERT_TILE="ox,oy,s"` + `THREERT_FRAME_ASPECT`):
each tile is rendered exactly as that part of the full frame, with a 32 px overlap so the denoiser never sees a tile edge,
and `tile.py` stitches them. Verified: a 2×2 tiled frame matches a normal render (same brightness per quadrant, no seam).
Vignette and bloom are off in the renderer (they are per-image effects) and a gentle vignette is added after stitching.

## Re-render
1. Apply `threert-tile.patch` to ThreeRT and `cargo build --release` in `renderer/`.
2. Copy the scenes into ThreeRT's `scenes/`; fetch assets:
   `node tools/fetch-polyhaven.ts --res 1k --models <models below>` and textures `yellow_plaster` (1k), `red_sandstone_tiles` (2k).
   The cleaned diffuse maps `kaasth_limewash_diff_1k.jpg` / `kaasth_sandstone_diff_2k.jpg` are made from those scans (softer variation, ivory / warm sandstone tone).
3. `node tools/build-scenes.ts kaasth-heirloom` then `python3 tile.py out/bundles/kaasth-heirloom.js out.png 2560 1440 2 2 32 32`.
About 40 minutes per desktop image and 24 per phone image on a software GPU.

## Assets (all CC0 from Poly Haven, https://polyhaven.com/license)
Models: vintage_day_bed, throw_pillows_01, vintage_cabinet_01, ArmChair_01, brass_pot_01, brass_vase_01, brass_diya_lantern,
modern_wooden_cabinet, ceramic_vase_02, modern_coffee_table_01, modern_arm_chair_01, potted_plant_02 (+ mid_century_lounge_chair for the product viewer).
Textures: red_sandstone_tiles, yellow_plaster. Room shell, jaali, rug and chest are simple shapes in the scene code.
