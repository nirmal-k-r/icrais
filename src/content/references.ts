/**
 * Single source for every citation in the show.
 * source 'paper': copied from the paper's bibliography (authors + year are checked against sources/paper.txt).
 * source 'added': not in the paper; each was looked up (DOI or ISBN recorded) rather than written from memory.
 */
export interface Ref {
  id: string
  /** how it appears on a slide, e.g. "Plum et al. 2014" */
  label: string
  authors: string
  year: number
  title: string
  venue: string
  source: 'paper' | 'added'
  paperNo?: number
  doi?: string
  isbn?: string
}

export const references: Ref[] = [
  { id: 'kjeldsen2017', label: 'Kjeldsen 2017', authors: 'Kjeldsen KH', year: 2017, title: 'Classification of ship routing and scheduling problems in liner shipping', venue: 'INFOR 49:139–152', source: 'paper', paperNo: 2, doi: '10.3138/INFOR.49.2.139' },
  { id: 'brouer2014', label: 'Brouer et al. 2014', authors: 'Brouer BD, Desaulniers G, Pisinger D', year: 2014, title: 'A matheuristic for the liner shipping network design problem', venue: 'Transp Res E 72:42–59', source: 'paper', paperNo: 3, doi: '10.1016/J.TRE.2014.09.012' },
  { id: 'christiansen2020', label: 'Christiansen et al. 2020', authors: 'Christiansen M, Hellsten E, Pisinger D, Sacramento D, Vilhelmsen C', year: 2020, title: 'Liner shipping network design', venue: 'Eur J Oper Res 286:1–20', source: 'paper', paperNo: 5, doi: '10.1016/J.EJOR.2019.09.057' },
  { id: 'plum2014', label: 'Plum et al. 2014', authors: 'Plum CEM, Pisinger D, Sigurd MM', year: 2014, title: 'A service flow model for the liner shipping network design problem', venue: 'Eur J Oper Res 235:378–386', source: 'paper', paperNo: 10, doi: '10.1016/J.EJOR.2013.10.057' },
  { id: 'cheaitou2020', label: 'Cheaitou et al. 2020', authors: 'Cheaitou A, Hamdan S, Larbi R', year: 2020, title: 'Liner shipping network design with sensitive demand', venue: 'Marit Bus Rev 6:293–313', source: 'paper', paperNo: 4, doi: '10.1108/MABR-10-2019-0045' },
  { id: 'zheng2015', label: 'Zheng et al. 2015', authors: 'Zheng J, Meng Q, Sun Z', year: 2015, title: 'Liner hub-and-spoke shipping network design', venue: 'Transp Res E 75:32–48', source: 'paper', paperNo: 8, doi: '10.1016/J.TRE.2014.12.014' },
  { id: 'gelareh2011', label: 'Gelareh and Pisinger 2011', authors: 'Gelareh S, Pisinger D', year: 2011, title: 'Fleet deployment, network design and hub location of liner shipping companies', venue: 'Transp Res E 47:947–964', source: 'paper', paperNo: 23, doi: '10.1016/J.TRE.2011.03.002' },
  { id: 'brouer2013', label: 'Brouer et al. 2013', authors: 'Brouer BD, Alvarez JF, Plum CEM, Pisinger D, Sigurd MM', year: 2013, title: 'A base integer programming model and benchmark suite for liner-shipping network design', venue: 'Transp Sci 48:281–312', source: 'paper', paperNo: 13, doi: '10.1287/TRSC.2013.0471' },
  { id: 'holland1992', label: 'Holland 1992', authors: 'Holland JH', year: 1992, title: 'Adaptation in natural and artificial systems', venue: 'MIT Press', source: 'paper', paperNo: 22 },
  { id: 'cariou2018', label: 'Cariou et al. 2018', authors: 'Cariou P, Cheaitou A, Larbi R, Hamdan S', year: 2018, title: 'Liner shipping network design with emission control areas: a genetic algorithm-based approach', venue: 'Transp Res D 63:604–621', source: 'paper', paperNo: 14, doi: '10.1016/J.TRD.2018.06.020' },
  { id: 'koza2020', label: 'Koza et al. 2020', authors: 'Koza DF, Desaulniers G, Ropke S', year: 2020, title: 'Integrated liner shipping network design and scheduling', venue: 'Transp Sci 54:512–533', source: 'paper', paperNo: 15, doi: '10.1287/TRSC.2018.0888' },
  { id: 'karsten2017a', label: 'Karsten et al. 2017a', authors: 'Vad Karsten C, Brouer BD, Pisinger D', year: 2017, title: 'Competitive liner shipping network design', venue: 'Comput Oper Res 87:125–136', source: 'paper', paperNo: 16, doi: '10.1016/J.COR.2017.05.018' },
  { id: 'karsten2017b', label: 'Karsten et al. 2017b', authors: 'Karsten CV, Brouer BD, Desaulniers G, Pisinger D', year: 2017, title: 'Time constrained liner shipping network design', venue: 'Transp Res E 105:152–162', source: 'paper', paperNo: 17, doi: '10.1016/J.TRE.2016.03.010' },
  { id: 'hellsten2021', label: 'Hellsten et al. 2021', authors: 'Hellsten E, Koza DF, Contreras I, Cordeau JF, Pisinger D', year: 2021, title: 'The transit time constrained fixed charge multi-commodity network design problem', venue: 'Comput Oper Res 136:105511', source: 'paper', paperNo: 12, doi: '10.1016/J.COR.2021.105511' },
  { id: 'krogsgaard2018', label: 'Krogsgaard et al. 2018', authors: 'Krogsgaard A, Pisinger D, Thorsen J', year: 2018, title: 'A flow-first route-next heuristic for liner shipping network design', venue: 'Networks 72:358–381', source: 'paper', paperNo: 7, doi: '10.1002/NET.21819' },
  // not in the paper's bibliography (looked up, DOI or ISBN recorded)
  { id: 'marler2004', label: 'Marler and Arora 2004', authors: 'Marler RT, Arora JS', year: 2004, title: 'Survey of multi-objective optimization methods for engineering', venue: 'Struct Multidisc Optim 26:369–395', source: 'added', doi: '10.1007/s00158-003-0368-6' },
  { id: 'psaraftis2013', label: 'Psaraftis and Kontovas 2013', authors: 'Psaraftis HN, Kontovas CA', year: 2013, title: 'Speed models for energy-efficient maritime transportation: a taxonomy and survey', venue: 'Transp Res C 26:331–351', source: 'added', doi: '10.1016/j.trc.2012.09.012' },
  { id: 'blum2011', label: 'Blum et al. 2011', authors: 'Blum C, Puchinger J, Raidl GR, Roli A', year: 2011, title: 'Hybrid metaheuristics in combinatorial optimization: a survey', venue: 'Appl Soft Comput 11:4135–4151', source: 'added', doi: '10.1016/j.asoc.2011.02.032' },
  { id: 'goldberg1989', label: 'Goldberg 1989', authors: 'Goldberg DE', year: 1989, title: 'Genetic algorithms in search, optimization, and machine learning', venue: 'Addison-Wesley', source: 'added', isbn: '9780201157673' },
]

const byId = new Map(references.map((r) => [r.id, r]))
export function ref(id: string): Ref {
  const r = byId.get(id)
  if (!r) throw new Error(`Unknown reference id: ${id}`)
  return r
}
/** cite('plum2014', 'brouer2014') -> "Plum et al. 2014; Brouer et al. 2014" */
export const cite = (...ids: string[]): string => ids.map((id) => ref(id).label).join('; ')
/** One formatted bibliography line. */
export const formatRef = (r: Ref): string => `${r.authors} (${r.year}) ${r.title}. ${r.venue}`
export const sortedReferences = (): Ref[] => [...references].sort((a, b) => a.authors.localeCompare(b.authors) || a.year - b.year)
