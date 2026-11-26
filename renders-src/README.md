# Hero renders (ThreeRT)

Photoreal rooms for the home hero, path-traced offline with [ThreeRT](https://github.com/meshy-dev/ThreeRT) (MIT, commit 07a9c29) and shipped as images. The ThreeRT engine is **not** part of the website.

| Scene | Output | Settings |
|---|---|---|
| `kaasth-heirloom.ts` | `public/renders/room-heirloom.jpg` | 1600×900, 32 spp, denoised |
| `kaasth-form.ts` | `public/renders/room-form.jpg` | 1600×900, 32 spp |
| `kaasth-heirloom-portrait.ts` | `public/renders/room-heirloom-portrait.jpg` | 960×1280, 32 spp (phones) |
| `kaasth-form-portrait.ts` | `public/renders/room-form-portrait.jpg` | 960×1280, 32 spp (phones) |

Re-render: copy the scene into ThreeRT's `scenes/`, run `node tools/fetch-polyhaven.ts --res 1k --models <ids below>`, then
`node tools/build-scenes.ts kaasth-heirloom` and `threert-render render out/bundles/kaasth-heirloom.js -o out.png --spp 32 --width 1600 --height 900`.
On a software GPU each landscape render takes about 11 minutes.

## Models (all CC0 from Poly Haven, https://polyhaven.com/license)
vintage_day_bed, throw_pillows_01, vintage_cabinet_01, ArmChair_01, brass_pot_01, brass_vase_01, brass_diya_lantern,
modern_wooden_cabinet, ceramic_vase_02, modern_coffee_table_01, modern_arm_chair_01, potted_plant_02 (and mid_century_lounge_chair for the product viewer).
Room, jaali, rug and chest are simple shapes built in the scene code.
