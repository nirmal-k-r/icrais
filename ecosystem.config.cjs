// pm2 start ecosystem.config.cjs            (port 3015)
// PORT=3200 pm2 start ecosystem.config.cjs  (another port; use the same one in the nginx proxy_pass)
module.exports = { apps: [{ name: 'icrais', script: 'server/server.mjs', env: { PORT: process.env.PORT || 3015 } }] }
