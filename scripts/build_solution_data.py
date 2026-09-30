"""One real solution on WorldLarge (the authors' saved run, seed 42), drawn by service type.

Source: results_pso_wl_v10_final/seed42/results.json
Service type comes from the candidate pool the service was picked from: pool_index 0..52 direct, 53..184 trunk,
185..311 feeder (config.POOL_TIERS = 53/132/127). Checked below: feeder services use only the Feeder_* vessel classes.
Lane loads come from the re-evaluation of the saved services.
"""
import json, math, pathlib, collections
root = pathlib.Path(__file__).resolve().parents[2] / 'results_pso_wl_v10_final' / 'seed42'
out = pathlib.Path(__file__).resolve().parents[1] / 'src' / 'data' / 'solution.json'
d = json.load(open(root / 'results.json'))

tiers = d['config']['POOL_TIERS']  # {'direct': 53, 'trunk': 132, 'feeder': 127}
edges_at = {'direct': (0, tiers['direct'])}
edges_at['trunk'] = (edges_at['direct'][1], edges_at['direct'][1] + tiers['trunk'])
edges_at['feeder'] = (edges_at['trunk'][1], edges_at['trunk'][1] + tiers['feeder'])
def kind(s):
    for k, (lo, hi) in edges_at.items():
        if lo <= s['pool_index'] < hi:
            return k
    raise ValueError(s['pool_index'])

services = d['services']
types = {s['service_id']: kind(s) for s in services}
for s in services:  # sanity check on the pool-order assumption
    is_feeder_class = s['vessel_class'].startswith('Feeder')
    assert (types[s['service_id']] == 'feeder') == is_feeder_class, s['service_id']

lanes = collections.defaultdict(float)
for s in services:
    for leg in s['legs']:
        lanes[(tuple(sorted((leg['frm'], leg['to']))), types[s['service_id']])] += float(leg['load_ffe_wk'])

# width: scaled within each type so trunk > direct > feeder, like the tier hierarchy
span = {'direct': (2.5, 6.0), 'trunk': (3.0, 9.0), 'feeder': (2.6, 5.4)}
mx = {k: max(math.log10(1 + v / 100) for (p, t), v in lanes.items() if t == k) for k in span}
lane_list = []
for ((a, b), t), load in sorted(lanes.items()):
    lo, hi = span[t]
    lane_list.append({'a': a, 'b': b, 'type': t, 'load': round(load, 1),
                      'width': round(lo + (hi - lo) * math.log10(1 + load / 100) / mx[t], 2)})

loop = next(s for s in services if s['service_id'] == 35)
assert types[35] == 'trunk' and loop['n_ports'] == 10
counts = collections.Counter(types.values())
ports = [{'code': p['code'], 'name': p['name'], 'lon': p['lon'], 'lat': p['lat'], 'hub': p['is_hub'], 'served': p['served']} for p in d['ports']]
json.dump({
    'instance': 'WorldLarge', 'services': len(services), 'portCount': len(ports),
    'direct': counts['direct'], 'trunk': counts['trunk'], 'feeder': counts['feeder'],
    'ports': ports, 'lanes': lane_list,
    'loop': {'serviceId': 35, 'vessels': loop['vessels'], 'ports': loop['ports']},
}, open(out, 'w'))
print('services', len(services), dict(counts), '| lanes by type', dict(collections.Counter(l['type'] for l in lane_list)), '|', out.stat().st_size // 1024, 'KB')
