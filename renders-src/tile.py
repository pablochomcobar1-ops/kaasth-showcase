"""Render a ThreeRT scene as overlapping off-axis tiles and stitch them (needs the THREERT_TILE patch)."""
import os, subprocess, sys
from PIL import Image
bundle, out, W, H, cols, rows, spp, m = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:9])
R='/tmp/threert/renderer/target/release/threert-render'
cw, ch = W // cols, H // rows
canvas = Image.new('RGB', (W, H))
for r in range(rows):
    for c in range(cols):
        x0, y0 = c * cw, r * ch
        tw, th = cw + 2 * m, ch + 2 * m
        cx, cy = x0 + cw / 2, y0 + ch / 2
        ox, oy, s = cx / W * 2 - 1, 1 - cy / H * 2, th / H
        env = dict(os.environ, THREERT_TILE=f'{ox},{oy},{s}', THREERT_FRAME_ASPECT=str(W / H))
        tp = f'/tmp/rt/tile_{r}_{c}.png'
        subprocess.run([R, 'render', bundle, '-o', tp, '--spp', str(spp), '--width', str(tw), '--height', str(th)], env=env, check=True, capture_output=True, cwd='/tmp/threert')
        canvas.paste(Image.open(tp).convert('RGB').crop((m, m, m + cw, m + ch)), (x0, y0))
        print(f'tile {r},{c} done', flush=True)
canvas.save(out)
