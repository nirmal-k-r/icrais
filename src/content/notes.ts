/** Speaker notes per scene id. Shown only in the notes PDF (?print&notes), never on the projected surface. */
export const notes: Record<string, string> = {
  title:
    'Good morning. I am Nirmal Rampersand, a PhD student and AI engineer at the University of Mauritius. I am glad to present this work, co-authored with Dr Oomesh Gukhool. It tackles a problem behind almost everything we buy. [Step: the title resolves to its three key ideas: Multi-Tier, Genetic Algorithm, Liner Shipping Network Design.]',
  question:
    'Is a shipping network well optimised if it earns profit but delivers little cargo? [Pause two beats after the question.] Picture two large hubs with a ship earning money between them, while a smaller port, say Port Louis, watches its containers wait. A useful network has to earn and deliver. That is the tension in this talk.',
  translate:
    'To answer that, I will use two things. An optimisation algorithm, a Genetic Algorithm, and a shipping problem, the Liner Shipping Network Design Problem, or LSNDP. One search over routes, fleet and cargo at once.',
  lsndp:
    'A liner network is ports, ships, cargo and routes. Ships call at ports, load, unload and transship containers, then move on along fixed loops. The decisions are coupled: putting a vessel on one route changes capacity elsewhere. The problem is NP-hard and has been studied for decades. The aim is to maximise profit while delivering the weekly demand.',
  challenges:
    'Existing approaches struggle on three fronts. Scalability: exact methods take over 10,800 seconds on a 19-port instance. Efficiency: the search space grows combinatorially. Effectiveness: methods that chase profit or simplify routing can leave a lot of demand undelivered on global networks.',
  related:
    'Prior work falls into three groups. Exact methods, such as the service-flow model of Plum and colleagues, give high-quality solutions but the run time degrades rapidly as networks grow; Brouer and colleagues\' matheuristic is a scalable step away from that. Hub-and-spoke designs by Zheng and by Gelareh and Pisinger scale better, but rely on predefined hubs and simplified routing. Metaheuristics and hybrids, including the genetic algorithm of Cariou and colleagues, Koza and colleagues, and Krogsgaard and colleagues, reach global instances such as WorldSmall but need careful tuning. Our contribution sits in the gap: service tiers built from demand, with delivered cargo rewarded in the search.',
  worldsmall:
    'We chose WorldSmall because we wanted to move beyond a small regional network. 47 ports, 263 vessels, 1,764 origin-destination pairs and about 128,000 FFE per week. Cargo must cross regions and connect through different vessel classes. Note: WorldSmall does not contain Port Louis; the Mauritius example in the opening is only an illustration.',
  whyga:
    'Why a genetic algorithm? It searches a huge space by evolving many candidate networks side by side instead of following a single path. The structure of a genome is also a natural fit for this problem: vessel assignment, route construction and cargo routing can all be handled together in one search. I will show that structure a little later. And genetic algorithms have already been applied to liner network design, for example Cariou and colleagues with emission control areas. So a GA was our starting point.',
  baseline:
    'But our baseline GA failed at scale. It served 99.6% of the demand on Baltic, yet only 15.9% on WorldSmall. It made money without delivering: the search settled early on networks that used few vessels and left the rest chartered out. That is what pushed us to build the large-network framework.',
  framework:
    'The proposal has four parts: profit and delivery in one fitness score; a four-tier service architecture; demand-aware initialisation; and adaptive mutation with elitism. The paper evaluates them together.',
  tiers:
    'Start with direct routes for the highest-demand port pairs. Trunk routes connect regional hubs. Feeders connect secondary ports to their hub. Regional loops give local access with the remaining fleet. The initial network is built in this order, guided by demand. This diagram is illustrative.',
  journey:
    'Follow one container: origin, feeder to the hub, trunk across to the other hub, feeder to the destination. A direct service is another option when suitable capacity exists. This is illustrative, not an extracted solution.',
  chromosome:
    'A chromosome is a complete candidate network; each gene is one vessel route. Genes are grouped by tier. Zoom into one gene: route R7, vessel V5, a trunk vessel, six port entries, a sequence that returns to P12, sailing twice a week. Changing the port order changes the connections the vessel offers. The example is conceptual.',
  objectives:
    'Profit and delivery have different units, dollars per week and percent of demand, so the search needs an explicit exchange rate between them.',
  fitness:
    'Fitness is profit plus alpha times delivery in percentage points. Alpha is 2.2 million when profit is positive and 1.3 million otherwise. Delivery is worth more than any profit the search found, which is deliberate: earlier runs drifted to sparse, profitable networks with vessels chartered out. Look ahead to the convergence chart: when profit crosses zero, alpha rises, and fitness jumps. This is a weighted scalar score, not a Pareto front.',
  penalty:
    'A very sparse network can disconnect much of the demand. Below 50 deployed vessels, fitness subtracts 300,000 per missing vessel and there is no delivery reward in that branch. Forty vessels is ten below, a three-million penalty. At 50 or more, the profit-and-delivery score applies. This is a worked example, not an experimental output.',
  search:
    'The GA evaluates complete networks, selects parents, recombines whole routes, mutates, and keeps the elites. Mutation starts at 45% and falls to about 22.5% by generation 200: explore early, refine late. Configuration: population 200, 25 elites, 200 generations, stop after 30 without improvement, 260 FFE direct threshold, at least 75 direct routes, 50-vessel minimum, cycles up to 8 weeks.',
  headline:
    'On WorldSmall the paper reports about 91% demand delivery against 15.9% for the baseline, roughly 75 percentage points more, with $37.2 million profit, 171 vessels and 157.7 seconds average runtime. These are outcomes of the complete framework, not of any single component.',
  network:
    'Here is what a solution looks like on WorldLarge, a much bigger instance with two hundred and one ports. I am showing structure, not totals. First the direct services: twenty-one point-to-point services for the biggest flows, run by the large vessel classes. Then the trunk services, twenty-four of them, the thick blue lines: long multi-port loops that pass through the hubs and carry the inter-regional traffic. Then the feeder services, fifty-two of them, dashed violet: small vessels gathering cargo around the hubs. Three types, three roles, which is exactly the hierarchy this framework is built around. Finally, one real trunk service: a ten-port loop from Jebel Ali through India, Thailand, Hong Kong and Shanghai to Felixstowe, Rotterdam, Bremerhaven and Algeciras and back, run by twenty-three vessels.',
  convergence:
    'These plots show one example run from the paper, Figure 2. Profit climbs from deeply negative and turns positive near generation 100. Delivery stabilises above 90% from about generation 111 and ends at 92%. Fitness jumps at generation 100 because alpha rises. Vessels fall from about 227 to 168. The paper headline and this example run are different summaries, so their endpoints differ slightly.',
  costs:
    'Fuel and charter costs fall as the search finds leaner routes; handling rises as more cargo is carried. In the lower plot, revenue rises and cost falls until a profit gap opens near generation 100.',
  breakdown:
    'In the example run: revenue $219.1M, cost $183.0M, model profit $36.2M. Fuel, handling and time charter make up about 90% of cost, which is why fleet allocation and route design matter so much to the financial objective.',
  regions:
    'Delivery in every region pair is above 90%, from 90.1% to 100% in this example run. The global figure weights actual cargo, so it is not the average of these nine cells. About 90% of delivered cargo is transhipped through hubs, which is what the tiers are designed for.',
  fleet:
    'WorldSmall offers six vessel classes. These bars are the available inventory, not the deployed fleet. The paper reports 171 of 263 vessels deployed. Larger classes support trunks; smaller ones feed the hubs.',
  literature:
    'The paper places the result beside published WorldSmall results: Brouer 2013, Karsten 2017, Koza 2020. Different formulations and conditions apply, so this is context, not a controlled head-to-head benchmark.',
  instances:
    'To see whether the architecture only works on WorldSmall, we ran the same framework and the baseline on the four smaller LINER-LIB instances: Baltic, WAF, Mediterranean and Pacific. Delivery rises on every one: Baltic from 55% to 66%, WAF from 18% to nearly 90%, Mediterranean from about 1% to 53%, Pacific from under 1% to 66%. Profit improves on Baltic, WAF and Pacific, although Pacific is still below zero. Mediterranean is the one that gets worse, going from just above zero to slightly negative. These are single runs with settings scaled from WorldSmall, not tuned per instance, and they are not part of the published results.',
  algorithm:
    'Three lessons about the algorithm itself. First, adding delivered demand to the fitness stopped the search settling on sparse, profitable networks, which the paper observed in earlier experiments. Second, demand-guided construction gives the GA connected networks to improve rather than random ones. Third, crossover swaps whole vessel routes, so good route structures survive, and adaptive mutation with elitism explores early and refines late. None of these effects is isolated by an ablation in the paper.',
  findings:
    'What we found: rewarding delivery and penalising sparse fleets steers the search away from profitable-but-empty networks; the service hierarchy keeps inter-regional cargo connected; and together they reached about 91% delivery and $37.2 million profit on WorldSmall. We did not isolate each component with an ablation.',
  next:
    'Next: transit-time constraints for time-sensitive cargo such as food; vessel-speed optimisation trading fuel against time; and hybrid metaheuristics.',
  references:
    'Sources for the claims in this talk, most of them from the paper\'s own bibliography. Leave it up briefly, then move to Thank you. The full list with DOIs is on the last pages of the speaker-notes PDF.',
  thanks:
    'Thank you. Email nirkramp@gmail.com, or scan the QR code to connect on LinkedIn. I welcome your questions.',
  close:
    'Back to the question. Is a network well optimised if it earns profit but delivers little cargo? No. It has to earn and deliver. Give the smaller port a feeder and its containers move: along the feeder, then the trunk. About 91% delivered, $37.2 million profit, on WorldSmall. Thank you. I welcome your questions.',
}

export const qaNotes: string[] = [
  'Where does the WorldLarge solution come from? It is not the Multi-Tier GA. It is the final run of our particle swarm optimisation (PSO, seed 42) on the larger WorldLarge instance, whose candidate pool has direct, trunk and feeder services (21, 24 and 52 of them are deployed): 201 ports, 9,622 OD pairs, about 138,900 FFE per week and 501 vessels. The saved run reports a profit of about $53.3M per week and 76.8% demand delivered, with 97 services and 312 of 501 vessels deployed. It is a different algorithm and a different instance, so those numbers are not comparable with the WorldSmall results. The slide shows structure only.',
  'Caveats to state if asked about the PSO solution: (1) the reported profit includes an idle-vessel credit of about $25.1M per week, because the 189 undeployed vessels are credited their time-charter cost as if chartered out; without it profit is about $28.0M per week. (2) Transit time is reported but not enforced (34% compliance). (3) The lane loads and flows on the slide come from re-evaluating the saved services, which lands about 0.4% lower in profit and 0.9 points lower in delivery than the saved run, for a reason we have not pinned down. (4) Unlike the GA evaluator, the PSO books demand against remaining link capacity.',
  'Why does this solution contain multi-port loops when the GA solution was mostly two-port shuttles? Different algorithms and instance sizes. The PSO encodes a pool of candidate services (direct, trunk, feeder) and selects among them, so long rotations appear naturally. On WorldSmall the GA solution in the paper strongly favours two- and three-port services.',
  'Where do the references come from? Fourteen are copied from the paper\'s own bibliography. Four were added after looking them up with their DOI or ISBN: Marler and Arora 2004 (weighted-sum methods), Psaraftis and Kontovas 2013 (ship speed), Blum and colleagues 2011 (hybrid metaheuristics) and Goldberg 1989 (genetic algorithms). Note two oddities in the paper: entry [26] (Goldberg and Holland 1979) is garbled, so the slides cite Goldberg 1989 instead, and LINER-LIB (Brouer et al.) is cited as 2013 as in the paper although it appears in the 2014 volume of Transportation Science. Worth fixing in the camera-ready version.',
  'Why are Mediterranean and Pacific unprofitable? Demand there is spread over hundreds of low-value pairs that the two-hub shuttle structure serves poorly, and hubs were chosen by a data-driven stand-in rather than set per instance. Also, transhipment handling is computed but not charged: per week that is about $0.29M for Baltic, $0.29M for WAF, $0.64M for Mediterranean and $6.2M for Pacific, so charging it would lower every profit on that slide (Baltic to about $0.42M, WAF to about $3.6M) and push the negative ones further down.',
  'Are the other-instance results validated? No. One seed per instance, settings scaled from WorldSmall, capacity not conserved. They are exploratory evidence that the delivery gain is not specific to WorldSmall, not a benchmark.',
  'Is this a Pareto optimisation? No. It addresses profit and delivery through a weighted scalar fitness and produces no Pareto front. Explain the weights and the fleet penalty directly.',
  'What is novel? The combination of a four-tier architecture, demand-guided construction and a fitness that rewards delivered demand. The paper evaluates the combined framework; it does not include an ablation of each component.',
  'Does the penalty directly penalise unmet demand? No. The explicit penalty is for fleet deployment below 50 vessels. Delivered demand enters as a weighted reward in the other branch.',
  'Why WorldSmall? Global connectivity, mixed vessel classes and many OD pairs. A single larger case is evidence about that instance, not a general scalability law.',
  'Is the 91% figure an average over runs? It is the value the paper reports for WorldSmall. The paper also notes about 3% profit variance over 10 runs. The notebook behind the paper figure shows 91.5% is the mean of the last five generations of the reported run and 93.4% the best.',
  'Why do the paper and the figure values differ? The paper summary and the Figure 2 example run are different summaries (about 91% and $37.2M versus 92.0% and $36.2M). Use the paper for headlines and the figure run for search traces and cost breakdown.',
  'Is delivered demand capacity-feasible? The evaluator checks link capacity per OD pair and may count shared links more than once, so the delivery percentage may be optimistic. A capacity-conserving flow model is future work. The talk reports the model outcomes and does not claim independent feasibility validation.',
  'Is transhipment cost included? The objective includes load and unload handling. Transhipment handling is computed but not charged in the current implementation: a known limitation.',
  'Why is fitness so much larger than profit? Fitness includes the alpha times delivery reward, so it is a selection score, not money.',
  'The paper says tournament selection; the code samples a parent pool. The process slide uses the general word "select".',
]
