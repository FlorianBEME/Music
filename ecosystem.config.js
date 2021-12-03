module.exports = {
  apps: [
    {
      script: "server.js",
      watch: ".",
    },
  ],
  // cd client && npm i && npm run build
  deploy: {
    production: {
      user: "root",
      host: "195.20.240.170",
      ref: "origin/deploy-branch",
      repo: "https://github.com/FlorianBEME/Music.git",
      path: "/var/www/musicfolder",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && cd client && npm install && npm run build && cd .. && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
