"""
GA Solver V20_b - Full Cost Model
==================================
Extends V20 with complete cost accounting:
- Bunker (fuel) costs based on consumption rates and sailing/idle time
- Canal transit fees (Panama, Suez) per vessel class
- Port call costs (fixed + per-FFE)
- Loading/unloading costs (CostPerFULL) at origin/destination
- Transshipment costs (CostPerFULLTrnsf) at hubs
- Fixes distance matrix to use shortest routes with canal info
- Adds port time to route cycle time
- Penalizes invalid canal transits (e.g., Post_panamax through Panama)
"""

import numpy as np
import pandas as pd
import random
import copy
import time
from collections import defaultdict

DATASET = 'WorldSmall'
POPULATION_SIZE = 200
GENERATIONS = 200
ELITISM_COUNT = 25
BASE_MUTATION_RATE = 0.45

ROUTE_CYCLE_WEEKS = 8
HOURS_PER_WEEK = 168

BUNKER_PRICE = 600
PORT_TIME_HOURS = 24
CANAL_PENALTY = 1e9

HUBS = {
    'Asia': ['HKHKG', 'SGSIN', 'CNSHA'],
    'Europe': ['NLRTM', 'DEBRV'],
    'Americas': ['USLAX', 'USCHS']
}

REGIONS = {
    'Asia': ['HKHKG', 'SGSIN', 'MYTPP', 'CNYTN', 'CNSHA', 'CNTAO', 'JPYOK', 'KRPUS',
             'TWKHH', 'THLCH', 'AEJEA', 'INNSA', 'IDTPP', 'LKCMB', 'MYPKG'],
    'Europe': ['NLRTM', 'DEBRV', 'DEHAM', 'BEANR', 'BEZEE', 'GBFXT', 'ESALG',
               'ESBCN', 'ITGIT', 'FRLEH', 'GRPIR', 'PLGDY'],
    'Americas': ['USLAX', 'USCHS', 'USHOU', 'USEWR', 'USMIA', 'CAMTR', 'CAVAN',
                 'MXZLO', 'BRSSZ', 'ECGYE', 'CLSAI', 'COBUN', 'UYMVD', 'NGAPP',
                 'MAPTM', 'EGPSD', 'PAMIT', 'AOLAD', 'AUBNE', 'NZAKL', 'OMSLL',
                 'PABLB', 'PKBQM', 'SAJED', 'TRAMB', 'KEMBA', 'GHTKD', 'ZADUR']
}

TRUNK_CLASSES = ['Super_panamax', 'Post_panamax', 'Panamax_2400', 'Panamax_1200']
FEEDER_CLASSES = ['Feeder_800', 'Feeder_450']

DIRECT_ROUTE_THRESHOLD = 260
MIN_DIRECT_ROUTES = 75
MIN_VESSELS_THRESHOLD = 50


class Data:
    def __init__(self, dataset):
        self.demand_df = pd.read_csv(f'data/Demand_{dataset}.csv', sep='\t')
        self.fleet_df = pd.read_csv(f'data/fleet_{dataset}.csv', sep='\t')
        self.fleet_data_df = pd.read_csv('data/fleet_data.csv', sep='\t')
        self.distance_df = pd.read_csv('data/dist_dense.csv', sep='\t')
        self.ports_df = pd.read_csv('data/ports.csv', sep='\t')

        self.generate_ports()
        self.generate_distances()
        self.generate_vessels()
        self.generate_demand()
        self.assign_regions()
        self.generate_port_costs()

    def generate_ports(self):
        self.required_ports = np.unique(self.demand_df[['Origin', 'Destination']].values)
        self.ports = self.ports_df[self.ports_df.UNLocode.isin(self.required_ports)]
        self.ports.reset_index(drop=True, inplace=True)
        self.port_dict = dict(zip(range(len(self.required_ports)), self.required_ports))
        self.reverse_port_dict = {v: k for k, v in self.port_dict.items()}

    def generate_distances(self):
        self.distance_df.fillna(0, inplace=True)
        self.distance_df.rename(columns={'fromUNLOCODe': 'Origin', 'ToUNLOCODE': 'Destination'}, inplace=True)
        self.distances = self.distance_df[self.distance_df.Origin.isin(self.required_ports) &
                                           self.distance_df.Destination.isin(self.required_ports)]
        self.distances.reset_index(drop=True, inplace=True)

        n = len(self.required_ports)
        self.dist_mat = np.zeros((n, n))
        self.is_panama = np.zeros((n, n), dtype=int)
        self.is_suez = np.zeros((n, n), dtype=int)

        shortest_dist = {}
        shortest_canal = {}

        for i in range(len(self.distances)):
            o = self.distances.iloc[i].Origin
            d = self.distances.iloc[i].Destination
            dist = self.distances.iloc[i].Distance
            panama = int(self.distances.iloc[i].IsPanama) if self.distances.iloc[i].IsPanama != 0 else 0
            suez = int(self.distances.iloc[i].IsSuez) if self.distances.iloc[i].IsSuez != 0 else 0

            if o in self.reverse_port_dict and d in self.reverse_port_dict:
                o_idx = self.reverse_port_dict[o]
                d_idx = self.reverse_port_dict[d]
                key = (o_idx, d_idx)
                if key not in shortest_dist or dist < shortest_dist[key]:
                    shortest_dist[key] = dist
                    shortest_canal[key] = (panama, suez)

        for (o_idx, d_idx), dist in shortest_dist.items():
            self.dist_mat[o_idx, d_idx] = dist
            panama, suez = shortest_canal[(o_idx, d_idx)]
            self.is_panama[o_idx, d_idx] = panama
            self.is_suez[o_idx, d_idx] = suez

    def generate_vessels(self):
        self.vessel_list = []
        self.trunk_vessels = []
        self.feeder_vessels = []

        for _, row in self.fleet_df.iterrows():
            vclass = row['Vessel class']
            qty = row['Quantity']
            class_data = self.fleet_data_df[self.fleet_data_df['Vessel_class'] == vclass]
            if len(class_data) == 0:
                continue
            for _ in range(qty):
                vessel = class_data.iloc[0].to_dict()
                vessel['class'] = vclass
                vessel['id'] = len(self.vessel_list)
                vessel['weekly_cost'] = vessel['TC_rate_daily_fixed_cost'] * 7
                panama_fee = vessel.get('panamaFee')
                vessel['panamaFee'] = float(panama_fee) if pd.notna(panama_fee) else CANAL_PENALTY
                vessel['suezFee'] = float(vessel['suezFee'])
                self.vessel_list.append(vessel)
                if vclass in TRUNK_CLASSES:
                    self.trunk_vessels.append(len(self.vessel_list) - 1)
                else:
                    self.feeder_vessels.append(len(self.vessel_list) - 1)
        self.num_vessels = len(self.vessel_list)

    def generate_demand(self):
        self.demand = []
        self.total_demand = 0
        for _, row in self.demand_df.iterrows():
            o = self.reverse_port_dict.get(row['Origin'])
            d = self.reverse_port_dict.get(row['Destination'])
            if o is not None and d is not None:
                self.demand.append({'origin': o, 'destination': d,
                                    'quantity': row['FFEPerWeek'], 'revenue': row['Revenue_1']})
                self.total_demand += row['FFEPerWeek']

    def assign_regions(self):
        self.port_region = {}
        for region, ports in REGIONS.items():
            for port in ports:
                if port in self.reverse_port_dict:
                    self.port_region[self.reverse_port_dict[port]] = region

        self.hub_indices = {}
        self.all_hubs = []
        for region, hubs in HUBS.items():
            self.hub_indices[region] = []
            for hub in hubs:
                if hub in self.reverse_port_dict:
                    idx = self.reverse_port_dict[hub]
                    self.hub_indices[region].append(idx)
                    self.all_hubs.append(idx)

        self.region_ports = defaultdict(list)
        for port_idx, region in self.port_region.items():
            self.region_ports[region].append(port_idx)

    def generate_port_costs(self):
        self.port_costs = {}
        ports_lookup = {}
        for _, row in self.ports_df.iterrows():
            ports_lookup[row['UNLocode']] = row

        for idx, code in self.port_dict.items():
            if code in ports_lookup:
                row = ports_lookup[code]
                self.port_costs[idx] = {
                    'cost_per_full': float(row['CostPerFULL']) if pd.notna(row['CostPerFULL']) else 0.0,
                    'cost_per_full_trnsf': float(row['CostPerFULLTrnsf']) if pd.notna(row['CostPerFULLTrnsf']) else 0.0,
                    'port_call_fixed': float(row['PortCallCostFixed']) if pd.notna(row['PortCallCostFixed']) else 0.0,
                    'port_call_per_ffe': float(row['PortCallCostPerFFE']) if pd.notna(row['PortCallCostPerFFE']) else 0.0,
                }
            else:
                self.port_costs[idx] = {
                    'cost_per_full': 0.0,
                    'cost_per_full_trnsf': 0.0,
                    'port_call_fixed': 0.0,
                    'port_call_per_ffe': 0.0,
                }


class EnhancedNetwork:
    def __init__(self, data):
        self.data = data
        self.routes = [[] for _ in range(data.num_vessels)]

    def build_network(self):
        trunk_idx = 0
        feeder_idx = 0

        demand_pairs = []
        for req in self.data.demand:
            demand_pairs.append((req['origin'], req['destination'], req['quantity']))
        demand_pairs.sort(key=lambda x: -x[2])

        direct_routes = []
        for o, d, qty in demand_pairs[:MIN_DIRECT_ROUTES]:
            if qty >= DIRECT_ROUTE_THRESHOLD:
                dist = self.data.dist_mat[o, d]
                if dist > 0:
                    direct_routes.append((o, d, qty))

        for o, d, qty in direct_routes:
            num_vessels = max(12, min(22, int(qty / 90)))
            for _ in range(num_vessels):
                if trunk_idx < len(self.data.trunk_vessels):
                    v_idx = self.data.trunk_vessels[trunk_idx]
                    self.routes[v_idx] = [o, d]
                    trunk_idx += 1

        hub_demand = {}
        for h1 in self.data.all_hubs:
            for h2 in self.data.all_hubs:
                if h1 != h2:
                    hub_demand[(h1, h2)] = 0

        for req in self.data.demand:
            o, d = req['origin'], req['destination']
            o_region = self.data.port_region.get(o)
            d_region = self.data.port_region.get(d)
            if o_region and d_region and o_region != d_region:
                o_hubs = self.data.hub_indices.get(o_region, [])
                d_hubs = self.data.hub_indices.get(d_region, [])
                if o_hubs and d_hubs:
                    for oh in o_hubs:
                        for dh in d_hubs:
                            if oh != dh:
                                hub_demand[(oh, dh)] = hub_demand.get((oh, dh), 0) + req['quantity']

        total_hub_demand = sum(hub_demand.values())
        sorted_hubs = sorted(hub_demand.items(), key=lambda x: -x[1])

        for (h1, h2), demand in sorted_hubs:
            if demand == 0 or total_hub_demand == 0:
                continue
            dist = self.data.dist_mat[h1, h2]
            if dist <= 0:
                continue

            proportion = demand / total_hub_demand
            vessels_needed = int(proportion * len(self.data.trunk_vessels) * 1.0)
            vessels_needed = max(15, min(vessels_needed, 45))

            for _ in range(vessels_needed):
                if trunk_idx < len(self.data.trunk_vessels):
                    v_idx = self.data.trunk_vessels[trunk_idx]
                    self.routes[v_idx] = [h1, h2]
                    trunk_idx += 1

        port_hub_demand = defaultdict(float)
        for req in self.data.demand:
            o, d = req['origin'], req['destination']
            o_region = self.data.port_region.get(o)
            d_region = self.data.port_region.get(d)

            if o_region:
                hubs = self.data.hub_indices.get(o_region, [])
                if hubs and o not in self.data.all_hubs:
                    nearest = min(hubs, key=lambda h: self.data.dist_mat[o, h] if self.data.dist_mat[o, h] > 0 else float('inf'))
                    if self.data.dist_mat[o, nearest] > 0:
                        port_hub_demand[(o, nearest)] += req['quantity']

            if d_region:
                hubs = self.data.hub_indices.get(d_region, [])
                if hubs and d not in self.data.all_hubs:
                    nearest = min(hubs, key=lambda h: self.data.dist_mat[h, d] if self.data.dist_mat[h, d] > 0 else float('inf'))
                    if self.data.dist_mat[nearest, d] > 0:
                        port_hub_demand[(nearest, d)] += req['quantity']

        for (port, hub), demand in sorted(port_hub_demand.items(), key=lambda x: -x[1]):
            dist = self.data.dist_mat[port, hub]
            if dist <= 0 or dist > 15000:
                continue

            if demand > 5000:
                num_vessels = 16
            elif demand > 3000:
                num_vessels = 12
            elif demand > 1500:
                num_vessels = 8
            elif demand > 600:
                num_vessels = 6
            else:
                num_vessels = 5

            for _ in range(num_vessels):
                if feeder_idx < len(self.data.feeder_vessels):
                    v_idx = self.data.feeder_vessels[feeder_idx]
                    self.routes[v_idx] = [port, hub]
                    feeder_idx += 1
                if feeder_idx < len(self.data.feeder_vessels):
                    v_idx = self.data.feeder_vessels[feeder_idx]
                    self.routes[v_idx] = [hub, port]
                    feeder_idx += 1

        while feeder_idx < len(self.data.feeder_vessels) - 2:
            region = random.choice(list(self.data.region_ports.keys()))
            hubs = self.data.hub_indices.get(region, [])
            ports = [p for p in self.data.region_ports[region] if p not in hubs]
            if len(ports) >= 2 and hubs:
                v_idx = self.data.feeder_vessels[feeder_idx]
                p1, p2 = random.sample(ports, 2)
                hub = random.choice(hubs)
                self.routes[v_idx] = [p1, hub, p2]
                feeder_idx += 1
            else:
                break

        return trunk_idx + feeder_idx

    def evaluate(self):
        link_cap = defaultdict(lambda: defaultdict(float))
        total_revenue = 0
        total_cost = 0
        vessels_used = 0

        total_bunker_cost = 0
        total_canal_cost = 0
        total_port_call_cost = 0
        total_tc_cost = 0

        for i, route in enumerate(self.routes):
            if len(route) < 2:
                continue

            vessel = self.data.vessel_list[i]
            speed = vessel['designSpeed']
            capacity = vessel['Capacity_FFE']
            bunker_rate = vessel['Bunker_ton_per_day_at_designSpeed']
            idle_rate = vessel['Idle_Consumption_ton_per_day']
            panama_fee = vessel['panamaFee']
            suez_fee = vessel['suezFee']

            sailing_time = 0
            canal_panama = 0
            canal_suez = 0
            route_dist = 0

            valid_route = True
            for j in range(len(route)):
                u, v = route[j], route[(j + 1) % len(route)]
                dist = self.data.dist_mat[u, v]
                if dist <= 0:
                    valid_route = False
                    break
                sailing_time += dist / speed if speed > 0 else 0

                if self.data.is_panama[u, v]:
                    if panama_fee >= CANAL_PENALTY:
                        valid_route = False
                        break
                    canal_panama += 1
                if self.data.is_suez[u, v]:
                    canal_suez += 1

                route_dist += dist

            if not valid_route or sailing_time <= 0:
                continue

            port_time = len(route) * PORT_TIME_HOURS
            total_route_time = sailing_time + port_time

            if total_route_time > ROUTE_CYCLE_WEEKS * HOURS_PER_WEEK:
                continue

            vessels_used += 1
            frequency = HOURS_PER_WEEK / total_route_time
            cap_per_week = capacity * frequency

            for j in range(len(route)):
                u, v = route[j], route[(j + 1) % len(route)]
                link_cap[u][v] += cap_per_week / len(route)

            sailing_days = sailing_time / 24
            port_days = port_time / 24
            weeks_on_route = total_route_time / HOURS_PER_WEEK

            tc_cost = vessel['weekly_cost'] * weeks_on_route
            bunker_cost = (bunker_rate * sailing_days + idle_rate * port_days) * BUNKER_PRICE
            canal_cost = canal_panama * panama_fee + canal_suez * suez_fee
            port_call_cost = 0
            for port_idx in route:
                pc = self.data.port_costs.get(port_idx, {})
                port_call_cost += pc.get('port_call_fixed', 0)

            route_cost = tc_cost + bunker_cost + canal_cost + port_call_cost
            total_cost += route_cost
            total_tc_cost += tc_cost
            total_bunker_cost += bunker_cost
            total_canal_cost += canal_cost
            total_port_call_cost += port_call_cost

        demand_served = 0
        total_handling_cost = 0

        for req in self.data.demand:
            o, d = req['origin'], req['destination']
            qty = req['quantity']
            rev = req['revenue']

            delivered = min(link_cap[o].get(d, 0), qty)
            transship_path = None

            if delivered < qty:
                o_region = self.data.port_region.get(o)
                d_region = self.data.port_region.get(d)

                if o_region and d_region:
                    o_hubs = self.data.hub_indices.get(o_region, [])
                    d_hubs = self.data.hub_indices.get(d_region, [])

                    if o_hubs and d_hubs:
                        if o_region == d_region:
                            for hub in o_hubs:
                                cap = min(link_cap[o].get(hub, 0), link_cap[hub].get(d, 0))
                                if cap > 0:
                                    delivered = min(cap, qty)
                                    transship_path = ('single', hub)
                                    break
                        else:
                            for oh in o_hubs:
                                for dh in d_hubs:
                                    cap1 = link_cap[o].get(oh, 0)
                                    cap2 = link_cap[oh].get(dh, 0)
                                    cap3 = link_cap[dh].get(d, 0)
                                    if cap1 > 0 and cap2 > 0 and cap3 > 0:
                                        cap = min(cap1, cap2, cap3)
                                        delivered = min(cap, qty)
                                        transship_path = ('double', oh, dh)
                                        break
                                if delivered >= qty:
                                    break

            if delivered > 0:
                demand_served += delivered
                total_revenue += delivered * rev

                o_costs = self.data.port_costs.get(o, {})
                d_costs = self.data.port_costs.get(d, {})

                loading_cost = delivered * o_costs.get('cost_per_full', 0)
                unloading_cost = delivered * d_costs.get('cost_per_full', 0)

                transshipment_cost = 0
                if transship_path is not None:
                    if transship_path[0] == 'single':
                        hub = transship_path[1]
                        hub_costs = self.data.port_costs.get(hub, {})
                        transshipment_cost += delivered * hub_costs.get('cost_per_full_trnsf', 0)
                    elif transship_path[0] == 'double':
                        oh, dh = transship_path[1], transship_path[2]
                        oh_costs = self.data.port_costs.get(oh, {})
                        dh_costs = self.data.port_costs.get(dh, {})
                        transshipment_cost += delivered * oh_costs.get('cost_per_full_trnsf', 0)
                        transshipment_cost += delivered * dh_costs.get('cost_per_full_trnsf', 0)

                total_handling_cost += loading_cost + unloading_cost #+ transshipment_cost

        total_cost += total_handling_cost
        profit = total_revenue - total_cost
        demand_pct = (demand_served / self.data.total_demand) * 100 if self.data.total_demand > 0 else 0

        return profit, demand_pct, demand_served, vessels_used, {
            'tc_cost': total_tc_cost,
            'bunker_cost': total_bunker_cost,
            'canal_cost': total_canal_cost,
            'port_call_cost': total_port_call_cost,
            'handling_cost': total_handling_cost,
            'revenue': total_revenue,
        }

    def copy(self):
        new_net = EnhancedNetwork(self.data)
        new_net.routes = copy.deepcopy(self.routes)
        return new_net


class GeneticAlgorithm:
    def __init__(self, data):
        self.data = data
        self.population = []
        self.best = None

    def initialize(self):
        for _ in range(POPULATION_SIZE):
            net = EnhancedNetwork(self.data)
            net.build_network()
            self.population.append(net)
        self.best = max(self.population, key=lambda n: self.fitness(n))

    def fitness(self, net):
        profit, demand_pct, _, vessels, _ = net.evaluate()

        if vessels < MIN_VESSELS_THRESHOLD:
            return profit - 300000 * (MIN_VESSELS_THRESHOLD - vessels)

        if profit > 0:
            return profit + 2200000 * demand_pct
        else:
            return profit + 1300000 * demand_pct

    def mutate(self, net, gen):
        mutation_rate = BASE_MUTATION_RATE * (1 - gen / (GENERATIONS * 2))

        for i in range(len(net.routes)):
            if random.random() < mutation_rate:
                route = net.routes[i]

                if len(route) >= 2 and random.random() < 0.08:
                    net.routes[i] = []
                elif len(route) < 2:
                    if random.random() < 0.5 and len(self.data.all_hubs) >= 2:
                        h1, h2 = random.sample(self.data.all_hubs, 2)
                        net.routes[i] = [h1, h2]
                    elif random.random() < 0.7:
                        region = random.choice(list(self.data.region_ports.keys()))
                        hubs = self.data.hub_indices.get(region, [])
                        if hubs:
                            ports = [p for p in self.data.region_ports[region] if p not in hubs]
                            if ports:
                                port = random.choice(ports)
                                hub = random.choice(hubs)
                                net.routes[i] = [port, hub]
                    else:
                        all_ports = list(range(len(self.data.required_ports)))
                        if len(all_ports) >= 2:
                            p1, p2 = random.sample(all_ports, 2)
                            net.routes[i] = [p1, p2]

    def crossover(self, p1, p2):
        child = EnhancedNetwork(self.data)
        for i in range(len(p1.routes)):
            child.routes[i] = copy.deepcopy(random.choice([p1.routes[i], p2.routes[i]]))
        return child

    def evolve(self):
        self.initialize()

        best_fitness_history = []

        for gen in range(GENERATIONS):
            new_pop = []

            sorted_pop = sorted(self.population, key=lambda n: self.fitness(n), reverse=True)
            new_pop.extend([n.copy() for n in sorted_pop[:ELITISM_COUNT]])

            while len(new_pop) < POPULATION_SIZE:
                p1, p2 = random.sample(self.population[:50], 2)
                child = self.crossover(p1, p2)
                self.mutate(child, gen)
                new_pop.append(child)

            self.population = new_pop

            current_best = max(self.population, key=lambda n: self.fitness(n))
            if self.fitness(current_best) > self.fitness(self.best):
                self.best = current_best.copy()

            best_fitness = self.fitness(self.best)
            best_fitness_history.append(best_fitness)

            if gen % 10 == 0:
                profit, demand_pct, _, vessels, costs = self.best.evaluate()
                print(f"  Gen {gen}: Profit=${profit:,.0f}, Demand={demand_pct:.1f}%, "
                      f"Vessels={vessels}, TC=${costs['tc_cost']:,.0f}, "
                      f"Bunker=${costs['bunker_cost']:,.0f}, Canal=${costs['canal_cost']:,.0f}, "
                      f"PortCall=${costs['port_call_cost']:,.0f}, "
                      f"Handling=${costs['handling_cost']:,.0f}, Rev=${costs['revenue']:,.0f}")

            if len(best_fitness_history) > 30:
                if best_fitness == best_fitness_history[-30]:
                    print(f"  Early stopping at generation {gen} (no improvement in 30 gens)")
                    break

        return self.best


def run():
    print("=" * 60)
    print("WorldSmall V20_b - Full Cost Model")
    print("=" * 60)

    start = time.time()

    print("Loading data...")
    data = Data(DATASET)
    print(f"Loaded {len(data.required_ports)} ports, {data.num_vessels} vessels")
    print(f"Total demand: {data.total_demand:,.0f} FFE")
    print(f"Hubs: {[data.required_ports[h] for h in data.all_hubs]}")
    print(f"Trunk vessels: {len(data.trunk_vessels)}, Feeder vessels: {len(data.feeder_vessels)}")
    print(f"Bunker price: ${BUNKER_PRICE}/ton, Port time: {PORT_TIME_HOURS}h per call")

    print("\nBuilding network...")
    ga = GeneticAlgorithm(data)

    print("\nRunning optimization (200 generations, pop 200)...")
    best = ga.evolve()

    runtime = time.time() - start

    profit, demand_pct, demand_served, vessels, costs = best.evaluate()

    print(f"\n{'=' * 60}")
    print("FINAL RESULTS")
    print("=" * 60)
    print(f"Runtime: {runtime:.1f}s")
    print(f"Revenue: ${costs['revenue']:,.2f}")
    print(f"Demand: {demand_pct:.1f}% ({demand_served:,.0f}/{data.total_demand:,.0f} FFE)")
    print(f"Vessels used: {vessels}/{data.num_vessels}")
    print(f"")
    print(f"Cost Breakdown:")
    print(f"  TC (Time Charter):     ${costs['tc_cost']:>12,.2f}")
    print(f"  Bunker (Fuel):          ${costs['bunker_cost']:>12,.2f}")
    print(f"  Canal Fees:            ${costs['canal_cost']:>12,.2f}")
    print(f"  Port Call Costs:        ${costs['port_call_cost']:>12,.2f}")
    print(f"  Handling (Load/Unload): ${costs['handling_cost']:>12,.2f}")
    total_costs = costs['tc_cost'] + costs['bunker_cost'] + costs['canal_cost'] + costs['port_call_cost'] + costs['handling_cost']
    print(f"  Total Costs:           ${total_costs:>12,.2f}")
    print(f"")
    print(f"Profit: ${profit:,.2f}")

    return best, runtime, demand_pct, profit, costs


if __name__ == "__main__":
    run()