/** Optional remote control: only active when the page is opened with ?remote (phone or Apple Watch drive it). */
export type RemoteCommand = 'next' | 'prev' | 'nextScene' | 'prevScene' | 'home' | 'end' | 'black' | 'theme'
const ALLOWED = new Set<string>(['next', 'prev', 'nextScene', 'prevScene', 'home', 'end', 'black', 'theme'])

export function startRemote(onCommand: (c: RemoteCommand) => void): () => void {
  const params = new URLSearchParams(location.search)
  if (!params.has('remote') || typeof EventSource === 'undefined' || location.protocol === 'file:') return () => {}
  const es = new EventSource(`${params.get('remoteBase') ?? ''}/events`)
  es.onmessage = (e) => {
    try {
      const { cmd } = JSON.parse(e.data)
      if (ALLOWED.has(cmd)) onCommand(cmd as RemoteCommand)
    } catch {
      /* ignore malformed messages */
    }
  }
  return () => es.close()
}
