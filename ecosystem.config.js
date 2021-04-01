module.exports = {
  apps: [{
    name: "My App",
    script: "./server.js",
    env: {
      NODE_ENV: "development",
      HOST: "localhost",
      PORT: 3500,
      DB_NAME: "mydb",
      SECERET_KEY: "anyrandomstring",
      TOKEN_EXPIRE_IN: "30d"
    }
  }]
};
