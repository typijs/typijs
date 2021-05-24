module.exports = {
  apps : [{
    name: "CMS server",
    script: "./dist/server.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
