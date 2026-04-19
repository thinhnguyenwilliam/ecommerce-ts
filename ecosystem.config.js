// pm2 start ecosystem.config.js --env production
module.exports = {
  apps: [
    {
      name: "ecommerce-api",
      script: "dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
}