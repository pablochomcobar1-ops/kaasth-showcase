"""Post for stitched HD renders: patch the dark courtyard-edge strip in the jaali using the lattice's own repeat
(copy the band from one vertical period above, feathered), then add a gentle vignette."""
import sys, numpy as np
from PIL import Image
src, dst, wx0, wy0, wx1, wy1 = sys.argv[1], sys.argv[2], *map(float, sys.argv[3:7])
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H, W = im.shape[:2]
x0, y0, x1, y1 = int(wx0*W), int(wy0*H), int(wx1*W), int(wy1*H)
lum = im.mean(2)
# vertical period of the lattice from autocorrelation of a clean band just above the strip
ref = lum[y0-260:y0-10, x0:x1]; ref = ref - ref.mean()
best, P = -1e18, 0
for p in range(20, 220):
    c = (ref[p:] * ref[:-p]).mean()
    if c > best and p > 25: best, P = c, p
# copy each strip row from k periods above (k so the source is above the strip)
k = int(np.ceil((y1 - y0) / P))
out = im.copy()
feather = 6
for y in range(y0 - feather, y1 + feather):
    w = 1.0
    if y < y0: w = (y - (y0 - feather)) / feather
    if y >= y1: w = 1 - (y - y1 + 1) / feather
    out[y, x0:x1] = im[y, x0:x1]*(1-w) + im[y - k*P, x0:x1]*w
# feather left/right edges too
for i in range(feather):
    a = i / feather
    for xx in (x0 + i, x1 - 1 - i):
        out[y0:y1, xx] = im[y0:y1, xx]*(1-a) + out[y0:y1, xx]*a
im = out
yy, xx = np.mgrid[0:H, 0:W]
r = np.sqrt(((xx-W/2)/(W/2))**2 + ((yy-H/2)/(H/2))**2) / np.sqrt(2)
im *= (1 - 0.22*np.clip(r, 0, 1)**2.2)[..., None]
Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).save(dst, quality=95, subsampling=0, optimize=True, progressive=True)
print('saved', dst, 'period', P, 'k', k)
