"""Digitise the paper's Fig. 2 convergence + cost-trend PNGs into per-generation series.

Calibration comes from detected gridlines (pixel rows/cols) paired with the tick values printed on the
charts. Series are extracted by colour mask. The script fails if any validation check fails.
"""
import json, pathlib
import numpy as np
from PIL import Image
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT.parent / 'paper results'
OUT = ROOT / 'src' / 'data'
OVL = ROOT / 'scripts' / 'out'
OVL.mkdir(exist_ok=True)


def lin(p0, v0, p1, v1):
    k = (v1 - v0) / (p1 - p0)
    return lambda p: v0 + (np.asarray(p) - p0) * k


def hexrgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)])


def extract(im, color, box, x_of_gen, val_of_y, exclude=(), tol=48, gens=200):
    """box=(x0,x1,y0,y1) plot interior. Returns per-generation values (NaN gaps interpolated)."""
    x0, x1, y0, y1 = box
    sub = im[y0:y1, x0:x1]
    d = np.sqrt(((sub - hexrgb(color)) ** 2).sum(2))
    m = d <= tol
    for ex in exclude:  # (x0,x1,y0,y1) in full-image px
        ex0, ex1, ey0, ey1 = ex
        m[max(ey0 - y0, 0):max(ey1 - y0, 0), max(ex0 - x0, 0):max(ex1 - x0, 0)] = False
    col_y = np.full(x1 - x0, np.nan)
    for i in range(x1 - x0):
        ys = np.where(m[:, i])[0]
        if len(ys):
            col_y[i] = y0 + np.median(ys)
    vals = np.full(gens, np.nan)
    for g in range(gens):
        xc = int(round(x_of_gen(g))) - x0
        win = col_y[max(xc - 1, 0):xc + 2]
        win = win[~np.isnan(win)]
        if len(win):
            vals[g] = np.median(win)
    idx = np.arange(gens)
    ok = ~np.isnan(vals)
    vals = np.interp(idx, idx[ok], vals[ok])
    return val_of_y(vals)


def load(name):
    return np.array(Image.open(SRC / name).convert('RGB')).astype(int)


# ---------------- Convergence (2x2) ----------------
im = load('v20b_convergence.png')
xL = lin(217.5, 0, 1154.5, 200)          # px->gen  (left column)
gxL = lambda g: 217.5 + g * (1154.5 - 217.5) / 200
gxR = lambda g: 1370.5 + g * (2307.5 - 1370.5) / 200
prof_y = lin(145.5, 0, 686.5, -500e6)
deliv_y = lin(208.5, 80, 610.5, 20)
fit_y = lin(948.5, 200e6, 1550.5, -500e6)
ves_y = lin(922.5, 225, 1523.5, 50)

conv = {}
conv['profit'] = extract(im, '#1f77b4', (175, 1195, 78, 743), gxL, prof_y, exclude=[(860, 1195, 640, 743)])
conv['delivery'] = extract(im, '#ff7f0e', (1327, 2347, 78, 743), gxR, deliv_y, exclude=[(2040, 2347, 600, 743)])
conv['fitness'] = extract(im, '#2ca02c', (175, 1195, 889, 1553), gxL, fit_y)
conv['vessels'] = extract(im, '#d62728', (1327, 2347, 889, 1553), gxR, ves_y,
                          exclude=[(2080, 2347, 889, 945), (1327, 2347, 1517, 1530)])

# ---------------- Cost trends (2 stacked) ----------------
im2 = load('v20b_cost_trends.png')
gx2 = lambda g: 228.5 + g * (1963.5 - 228.5) / 200
top_y = lin(609.5, 0, 116.5, 250e6)
bot_y = lin(984.0, 0, 778.5, 400e6)
leg_top = (1765, 2040, 67, 218)
leg_bot = (146, 310, 696, 795)
costs = {}
for k, c in dict(tc='#1f77b4', bunker='#ff7f0e', canal='#2ca02c', port='#d62728', handling='#9467bd').items():
    costs[k] = extract(im2, c, (146, 2040, 67, 628), gx2, top_y, exclude=[leg_top])
costs['revenue'] = extract(im2, '#008000', (146, 2040, 696, 1257), gx2, bot_y, exclude=[leg_bot], tol=60)
costs['profit'] = extract(im2, '#0000ff', (146, 2040, 696, 1257), gx2, bot_y, exclude=[leg_bot], tol=90)
# total cost line is partly hidden by the legend in early generations: derive it (matches the sum of the 5 cost series)
costs['totalCost'] = costs['revenue'] - costs['profit']

# ---------------- Validation ----------------
EXACT = dict(profit=36154706.82, delivery=92.0, vessels=168)
COST_END = dict(bunker=69447377.90, handling=53227447.44, tc=42261985.26, canal=15037062.00,
                port=3007817.00, revenue=219136396.41, totalCost=182981689.60, profit=36154706.82)
spans = dict(profit=500e6, delivery=100, fitness=700e6, vessels=175)
report = []
fail = []


def check(label, got, want, span, tol=0.02):
    err = abs(got - want) / span
    report.append(f'{label}: got {got:.4g} want {want:.4g} err {err * 100:.2f}% of span')
    if err > tol:
        fail.append(label)


for k in ('profit', 'delivery', 'vessels'):
    check('conv.' + k, conv[k][-1], EXACT[k], spans[k])
check('conv.profit.start', conv['profit'][0], -485e6, spans['profit'])
check('conv.vessels.start', conv['vessels'][0], 227, spans['vessels'])
for k, v in COST_END.items():
    span = 250e6 if k in ('bunker', 'handling', 'tc', 'canal', 'port') else 800e6
    check('cost.' + k, costs[k][-1], v, span)
check('cost.bunker.start', costs['bunker'][0], 264e6, 250e6)
jump = conv['fitness'][103] - conv['fitness'][97]
report.append(f'fitness jump 97->103: {jump / 1e6:.1f}M')
if jump < 60e6: fail.append('fitness jump')
cross = int(np.argmax(conv['profit'] > 0))
report.append(f'profit first > 0 at gen {cross}')
if not 95 <= cross <= 110: fail.append('profit crossing')
print('\n'.join(report))

# ---------------- Overlay images ----------------
fig, ax = plt.subplots(figsize=(im.shape[1] / 100, im.shape[0] / 100), dpi=100)
ax.imshow(im.astype(np.uint8))
gens = np.arange(200)
def px(y_inv, vals):  # inverse map value->pixel for overlay
    return y_inv(vals)
inv = lambda p0, v0, p1, v1: (lambda v: p0 + (np.asarray(v) - v0) * (p1 - p0) / (v1 - v0))
ax.plot(gxL(gens), inv(145.5, 0, 686.5, -500e6)(conv['profit']), 'k--', lw=1)
ax.plot(gxR(gens), inv(208.5, 80, 610.5, 20)(conv['delivery']), 'k--', lw=1)
ax.plot(gxL(gens), inv(948.5, 200e6, 1550.5, -500e6)(conv['fitness']), 'k--', lw=1)
ax.plot(gxR(gens), inv(922.5, 225, 1523.5, 50)(conv['vessels']), 'k--', lw=1)
ax.axis('off'); fig.savefig(OVL / 'overlay-convergence.png', bbox_inches='tight'); plt.close(fig)

fig, ax = plt.subplots(figsize=(im2.shape[1] / 100, im2.shape[0] / 100), dpi=100)
ax.imshow(im2.astype(np.uint8))
for k in ('tc', 'bunker', 'canal', 'port', 'handling'):
    ax.plot(gx2(gens), inv(609.5, 0, 116.5, 250e6)(costs[k]), 'k--', lw=1)
for k in ('revenue', 'totalCost', 'profit'):
    ax.plot(gx2(gens), inv(984.0, 0, 778.5, 400e6)(costs[k]), 'k--', lw=1)
ax.axis('off'); fig.savefig(OVL / 'overlay-costs.png', bbox_inches='tight'); plt.close(fig)

if fail:
    raise SystemExit('VALIDATION FAILED: ' + ', '.join(fail))

# ---------------- Snap endpoints + write ----------------
conv['profit'][-1] = EXACT['profit']; conv['delivery'][-1] = EXACT['delivery']; conv['vessels'][-1] = EXACT['vessels']
for k, v in COST_END.items():
    costs[k][-1] = v
def r(a, n=2): return [round(float(x), n) for x in a]
json.dump({'generation': list(range(200)), **{k: r(v) for k, v in conv.items()}}, open(OUT / 'figrun-convergence.json', 'w'))
json.dump({'generation': list(range(200)), **{k: r(v) for k, v in costs.items()}}, open(OUT / 'figrun-costs.json', 'w'))
d = np.array(conv['delivery']); stable = int(np.where(d < 90)[0].max() + 1)
print('written; delivery stays >=90 from gen', stable, '| sum-of-5 vs derived total @0:', round(sum(costs[k][0] for k in ('tc','bunker','canal','port','handling'))/1e6,1), round(costs['totalCost'][0]/1e6,1))
