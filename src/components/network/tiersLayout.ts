import { link, makeRoute, chainD, quadD, type Pt } from '../../engine/geom'

const P = (x: number, y: number): Pt => ({ x, y })

export const regions = {
  americas: { name: 'Americas', label: P(300, 330), hub: P(420, 560), ports: [P(260, 400), P(250, 700), P(520, 800), P(590, 410)] },
  europe: { name: 'Europe', label: P(930, 215), hub: P(930, 420), ports: [P(760, 290), P(1100, 290), P(770, 520), P(1080, 540)] },
  asia: { name: 'Asia', label: P(1440, 380), hub: P(1400, 600), ports: [P(1250, 440), P(1600, 470), P(1620, 730), P(1300, 830)] },
}
export type RegionKey = keyof typeof regions
export const regionKeys = Object.keys(regions) as RegionKey[]

const { americas: am, europe: eu, asia: as } = regions

export const directLinks = [
  link(am.ports[0], eu.ports[0], 120),
  link(eu.ports[1], as.ports[1], 150),
]
export const trunkLinks = [
  link(am.hub, eu.hub, 0),
  link(eu.hub, as.hub, 0),
  link(am.hub, as.hub, -340),
]
export const feederLinks = regionKeys.flatMap((k) =>
  regions[k].ports.map((p) => link(p, regions[k].hub, 0)),
)
export const loopPorts: Record<RegionKey, Pt[]> = {
  americas: [am.ports[0], am.ports[3], am.ports[2], am.ports[1]],
  europe: [eu.ports[0], eu.ports[1], eu.ports[3], eu.ports[2]],
  asia: [as.ports[0], as.ports[1], as.ports[2], as.ports[3]],
}

/** cargo journey: Americas secondary port -> Americas hub -> Asia hub -> Asia secondary port */
export const journeyOrigin = am.ports[1]
export const journeyDest = as.ports[2]
export const journeyLegs = [
  link(journeyOrigin, am.hub, 0),
  trunkLinks[2],
  link(as.hub, journeyDest, 0),
]
export const journeyRoute = makeRoute(journeyLegs)
export const journeyD = journeyLegs.map(quadD)
export const journeyChainD = chainD(journeyLegs)
export const directAlt = link(journeyOrigin, journeyDest, -250)
