import { curveCatmullRomClosed, line } from 'd3-shape'
import { quadD } from '../../engine/geom'
import { DrawLink, Port, SvgText } from './parts'
import {
  directLinks, feederLinks, loopPorts, regionKeys, regions, trunkLinks,
} from './tiersLayout'

export interface Layers {
  ports: boolean
  direct: boolean
  trunk: boolean
  feeder: boolean
  loop: boolean
}
export const ALL_LAYERS: Layers = { ports: true, direct: true, trunk: true, feeder: true, loop: true }

const loopLine = line<{ x: number; y: number }>().x((p) => p.x).y((p) => p.y).curve(curveCatmullRomClosed.alpha(0.5))

// indices of the elements used by the cargo journey
const J_FEEDER = new Set([1, 10])
const J_TRUNK = 2

/**
 * The shared four-tier network used by scenes "tiers", "journey" and "chromosome".
 * `journey` dims everything except the origin→hub→hub→destination path.
 */
export function TiersNetwork({ layers, journey = false, startShown = false }: { layers: Layers; journey?: boolean; startShown?: boolean }) {
  const dim = 0.22
  const brightPort = (rk: string, i: number | 'hub') =>
    !journey || (rk === 'americas' && (i === 1 || i === 'hub')) || (rk === 'asia' && (i === 2 || i === 'hub'))
  return (
    <g>
      {regionKeys.map((rk) => (
        <g key={rk}>
          <SvgText x={regions[rk].label.x} y={regions[rk].label.y} anchor="middle" show={layers.ports} opacity={journey ? dim : 1} size={24}>
            {regions[rk].name}
          </SvgText>
        </g>
      ))}
      {/* loops first (behind) */}
      {regionKeys.map((rk, i) => (
        <DrawLink key={'l' + rk} d={loopLine(loopPorts[rk])! } tier="loop" show={layers.loop} delay={i * 0.2} opacity={journey ? dim : 1} startShown={startShown} drawTime={1.1} />
      ))}
      {feederLinks.map((q, i) => (
        <DrawLink key={'f' + i} d={quadD(q)} tier="feeder" show={layers.feeder} delay={(i % 4) * 0.08 + Math.floor(i / 4) * 0.12} opacity={!journey || J_FEEDER.has(i) ? 1 : dim} startShown={startShown} drawTime={0.6} />
      ))}
      {trunkLinks.map((q, i) => (
        <DrawLink key={'t' + i} d={quadD(q)} tier="trunk" show={layers.trunk} delay={i * 0.25} opacity={!journey || i === J_TRUNK ? 1 : dim} startShown={startShown} />
      ))}
      {directLinks.map((q, i) => (
        <DrawLink key={'d' + i} d={quadD(q)} tier="direct" show={layers.direct} delay={i * 0.3} opacity={journey ? dim : 1} startShown={startShown} />
      ))}
      {regionKeys.map((rk) => (
        <g key={rk}>
          {regions[rk].ports.map((p, i) => (
            <Port key={i} p={p} show={layers.ports} delay={i * 0.04} opacity={brightPort(rk, i) ? 1 : dim} startShown={startShown} />
          ))}
          <Port p={regions[rk].hub} r={18} hub show={layers.ports} delay={0.2} opacity={brightPort(rk, 'hub') ? 1 : dim} startShown={startShown} />
        </g>
      ))}
    </g>
  )
}
