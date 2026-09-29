import csv, json, pathlib, shutil, collections
root = pathlib.Path(__file__).resolve().parents[2]
res = root / 'results' / 'results_ga_v20_b'
data = pathlib.Path(__file__).resolve().parents[1] / 'src' / 'data'
ports = [
    dict(code=r['code'], name=r['name'], lon=float(r['lon']), lat=float(r['lat']),
         region=r['region'], isHub=r['is_hub'] == 'True')
    for r in csv.DictReader(open(res / 'ports.csv'))
]
assert len(ports) == 47 and sum(p['isHub'] for p in ports) == 7
json.dump(ports, open(data / 'ports.json', 'w'))
cnt = collections.Counter(r['vessel_class'] for r in csv.DictReader(open(res / 'vessels.csv')))
order = ['Feeder_450', 'Feeder_800', 'Panamax_1200', 'Panamax_2400', 'Post_panamax', 'Super_panamax']
assert [cnt[c] for c in order] == [24, 29, 68, 74, 58, 10], cnt
json.dump([{'class': c, 'quantity': cnt[c]} for c in order], open(data / 'fleet.json', 'w'))
shutil.copy(pathlib.Path(__file__).resolve().parents[1] / 'node_modules/world-atlas/land-110m.json', data / 'land-110m.json')
print('ok', len(ports), dict(cnt))
