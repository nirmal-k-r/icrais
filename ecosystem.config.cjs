// pm2 start ecosystem.config.cjs
module.exports = { apps: [{ name: 'icrais', script: 'server/server.mjs', env: { PORT: 3000 } }] }
