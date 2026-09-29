import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { claim } from '../content/claims'
import { Reveal, RevealG } from '../components/Reveal'
import { DrawLink, SvgText } from '../components/network/parts'
import { TiersNetwork, type Layers } from '../components/network/TiersNetwork'
import { tierStyle, type Tier } from '../components/network/tiers'
import { directLinks, feederLinks, loopPorts, regionKeys, trunkLinks } from '../components/network/tiersLayout'
import { quadAt, type Pt } from '../engine/geom'
import { easeInOut, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

interface Blk { tier: Tier; from: Pt }
const centroid = (ps: Pt[]) => ({ x: ps.reduce((s, p) => s + p.x, 0) / ps.length, y: ps.reduce((s, p) => s + p.y, 0) / ps.length })
const blocks: Blk[] = [
  ...directLinks.map((q) => ({ tier: 'direct' as Tier, from: quadAt(q, 0.5) })),
  ...trunkLinks.map((q) => ({ tier: 'trunk' as Tier, from: quadAt(q, 0.5) })),
  ...feederLinks.map((q) => ({ tier: 'feeder' as Tier, from: quadAt(q, 0.5) })),
  ...regionKeys.map((k) => ({ tier: 'loop' as Tier, from: centroid(loopPorts[k]) })),
]
const BW = 58, BH = 72, PITCH = 66, GGAP = 20, X0 = 138, ROW_Y = 420
const groups: Tier[] = ['direct', 'trunk', 'feeder', 'loop']
const groupLabel: Record<Tier, string> = { direct: 'Direct routes', trunk: 'Trunk routes', feeder: 'Feeder routes', loop: 'Regional loops' }
const slot = blocks.map((b, i) => ({ x: X0 + i * PITCH + groups.indexOf(b.tier) * GGAP, tier: b.tier }))
const groupSpan = groups.map((g) => {
  const s = slot.filter((x) => x.tier === g)
  return { g, x0: s[0].x, x1: s[s.length - 1].x + BW }
})
const trunkFirst = slot.findIndex((s) => s.tier === 'trunk')

// gene table
const cols = [
  { h: 'Route', v: claim('gene.route'), w: 130 },
  { h: 'Vessel', v: claim('gene.vessel'), w: 130 },
  { h: 'Class', v: claim('gene.class'), w: 170 },
  { h: 'Ports', v: claim('gene.nPorts'), w: 120 },
  { h: 'Sequence of ports', v: claim('gene.sequence'), w: 570 },
  { h: 'Per week', v: claim('gene.frequency'), w: 190 },
]
const TX = 120, TY = 660
const tw = cols.reduce((s, c) => s + c.w, 0)
const cyc = ['P12', 'P05', 'P08', 'P21', 'P17']
const CC = { x: 1650, y: 780 }
const cycPts = cyc.map((_, i) => ({ x: CC.x + 115 * Math.sin((i * 2 * Math.PI) / 5), y: CC.y - 115 * Math.cos((i * 2 * Math.PI) / 5) }))
const cycD = cycPts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ') + ' Z'

export function S11Chromosome({ step }: SceneProps) {
  const d = useDur()
  const compressed = step >= 1
  const layers: Layers = { ports: !compressed, direct: !compressed, trunk: !compressed, feeder: !compressed, loop: !compressed }
  let cx = TX
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show y={0} style={abs(120, 96, { ...T.h1s })}>{compressed ? 'From network to chromosome' : 'The whole network, as one candidate'}</Reveal>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <TiersNetwork layers={layers} startShown />
        {/* chromosome row */}
        <motion.g initial={{ opacity: 1 }} animate={{ opacity: step >= 2 ? 0.4 : 1 }} transition={{ duration: d(0.5) }}>
          {blocks.map((b, i) => {
            const st = tierStyle[b.tier]
            return (
              <motion.rect
                key={i}
                rx={4}
                fill={st.color}
                fillOpacity={0.12}
                stroke={st.color}
                strokeWidth={b.tier === 'trunk' ? 5 : 3}
                strokeDasharray={st.dash}
                initial={{ x: b.from.x - 6, y: b.from.y - 4, width: 12, height: 8, opacity: 0 }}
                animate={compressed
                  ? { x: slot[i].x, y: ROW_Y, width: BW, height: BH, opacity: 1 }
                  : { x: b.from.x - 6, y: b.from.y - 4, width: 12, height: 8, opacity: 0 }}
                transition={{ duration: d(compressed ? 1.2 : 0.4), delay: d(compressed ? 0.1 + i * 0.03 : 0), ease: easeInOut }}
              />
            )
          })}
        </motion.g>
        {groupSpan.map(({ g, x0, x1 }) => (
          <SvgText key={g} x={(x0 + x1) / 2} y={ROW_Y - 22} anchor="middle" size={22} weight={600} fill={tierStyle[g].color} show={compressed} delay={0.9}>{groupLabel[g]}</SvgText>
        ))}
        <RevealG show={compressed} delay={1.1}>
          <text x={138} y={330} fontSize={30} fill="var(--ink-2)">One chromosome = one complete network. One gene = one vessel route.</text>
        </RevealG>
        {/* zoom into a gene */}
        <RevealG show={step >= 2} delay={0.2}>
          <path d={`M${slot[trunkFirst].x} ${ROW_Y + BH} L${TX} ${TY - 30} M${slot[trunkFirst].x + BW} ${ROW_Y + BH} L${TX + tw} ${TY - 30}`} stroke="var(--cobalt)" strokeWidth={1.5} opacity={0.5} fill="none" />
          <line x1={TX} x2={TX + tw} y1={TY - 30} y2={TY - 30} stroke="var(--cobalt)" strokeWidth={3} />
          <line x1={TX} x2={TX + tw} y1={TY + 100} y2={TY + 100} stroke="var(--hair)" strokeWidth={2} />
          {cols.map((c) => {
            const x = cx
            cx += c.w
            return (
              <g key={c.h}>
                <text x={x} y={TY + 4} fontSize={22} fill="var(--muted)">{c.h}</text>
                <text x={x} y={TY + 70} fontSize={c.h === 'Sequence of ports' ? 34 : 40} fontWeight={600} fill="var(--ink)" className="mono">{c.v}</text>
              </g>
            )
          })}
        </RevealG>
        {/* the port order as a closed cycle */}
        <DrawLink d={cycD} tier="trunk" show={step >= 3} strokeWidth={5} />
        {cycPts.map((p, i) => (
          <RevealG key={i} show={step >= 3} delay={i * 0.12}>
            <circle cx={p.x} cy={p.y} r={13} fill="var(--bg)" stroke="var(--ink)" strokeWidth={4} />
            <text x={CC.x + 158 * Math.sin((i * 2 * Math.PI) / 5)} y={CC.y - 158 * Math.cos((i * 2 * Math.PI) / 5) + 8} fontSize={22} fontWeight={600} fill="var(--ink)" textAnchor="middle" className="mono">{cyc[i]}</text>
          </RevealG>
        ))}
        <SvgText x={CC.x} y={985} anchor="middle" size={24} show={step >= 3} delay={0.8}>Port order defines the closed cycle</SvgText>
      </svg>
    </div>
  )
}
