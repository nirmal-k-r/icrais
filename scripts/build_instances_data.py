"""Baseline GA vs Multi-Tier GA on the four LINER-LIB instances smaller than WorldSmall.

Source: results/results_ga_baseline/comparison.json (baseline + 'v20_b scaled', one run per instance, seed 42)
        results/results_ga_v20_b_multi/<X>_scaled/results.json (instance size: ports, vessels)
WorldSmall is deliberately excluded: its baseline here (1.4% delivery) is a different run from the paper's 15.9%.
"""
import json, pathlib
root = pathlib.Path(__file__).resolve().parents[2] / 'results'
cmp = json.load(open(root / 'results_ga_baseline' / 'comparison.json'))
out = []
for row in cmp:
    if row['dataset'] == 'WorldSmall':
        continue
    inst = json.load(open(root / 'results_ga_v20_b_multi' / f"{row['dataset']}_scaled" / 'results.json'))['instance']
    out.append({
        'name': row['dataset'],
        'ports': inst['n_ports'], 'vessels': inst['n_vessels'],
        'base': {'delivery': round(row['baseline']['demand_pct'], 1), 'profitM': round(row['baseline']['profit'] / 1e6, 2), 'used': row['baseline']['vessels_used']},
        'mt': {'delivery': round(row['v20b']['demand_pct'], 1), 'profitM': round(row['v20b']['profit'] / 1e6, 2), 'used': row['v20b']['vessels_used']},
    })
assert [o['name'] for o in out] == ['Baltic', 'WAF', 'Mediterranean', 'Pacific']
json.dump(out, open(pathlib.Path(__file__).resolve().parents[1] / 'src' / 'data' / 'instances.json', 'w'), indent=1)
print(json.dumps(out, indent=1))
