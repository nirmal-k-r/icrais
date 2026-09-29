// One small Node server for everything: serves the built slides AND the phone/watch remote.
//   node server/server.mjs            (build first: npm run build)
// No dependencies, no tokens. Env: PORT (default 3000), HOST (default 127.0.0.1).
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PORT = Number(process.env.PORT ?? 3000)
const HOST = process.env.HOST ?? '127.0.0.1'
const COMMANDS = new Set(['next', 'prev', 'nextScene', 'prevScene', 'home', 'end', 'black', 'theme'])
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.pdf': 'application/pdf', '.png': 'image/png', '.ico': 'image/x-icon' }

const listeners = new Set() // presenter pages opened with ?remote
let lastAt = 0

const send = (res, code, body, type = 'application/json') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' })
  res.end(typeof body === 'string' ? body : JSON.stringify(body))
}

async function serveFile(res, urlPath) {
  let rel = decodeURIComponent(urlPath)
  if (rel === '/' || rel === '') rel = '/index.html'
  if (rel === '/remote') rel = '/remote.html'
  const file = path.join(ROOT, path.normalize(rel))
  if (!file.startsWith(ROOT + path.sep)) return send(res, 403, { error: 'forbidden' })
  try {
    if (!(await stat(file)).isFile()) throw new Error('not a file')
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': rel === '/index.html' ? 'no-cache' : 'public, max-age=3600' })
    res.end(data)
  } catch {
    // single-page fallback for unknown paths
    try {
      res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-cache' })
      res.end(await readFile(path.join(ROOT, 'index.html')))
    } catch {
      send(res, 404, 'Not built yet: run "npm run build" first.', 'text/plain')
    }
  }
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')

  if (url.pathname === '/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' })
    res.write(': connected\n\n')
    listeners.add(res)
    const beat = setInterval(() => res.write(': hb\n\n'), 20000)
    req.on('close', () => { clearInterval(beat); listeners.delete(res) })
    return
  }
  if (url.pathname === '/health') return send(res, 200, { ok: true, listeners: listeners.size })

  const m = /^\/cmd\/([A-Za-z]+)$/.exec(url.pathname)
  if (m) {
    if (!COMMANDS.has(m[1])) return send(res, 400, { ok: false, error: 'unknown command' })
    const now = Date.now()
    if (now - lastAt < 150) return send(res, 200, { ok: true, dropped: 'duplicate' }) // absorb accidental double taps
    lastAt = now
    for (const l of listeners) l.write(`data: ${JSON.stringify({ cmd: m[1] })}\n\n`)
    return send(res, 200, { ok: true, cmd: m[1], listeners: listeners.size })
  }

  serveFile(res, url.pathname)
}).listen(PORT, HOST, () => console.log(`icrais listening on http://${HOST}:${PORT}  (slides at /, phone remote at /remote)`))
