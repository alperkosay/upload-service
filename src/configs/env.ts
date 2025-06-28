const env = {
  APP_PREFIX: process.env.APP_PREFIX || "/api",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  APP_VERSION: process.env.APP_VERSION || "v1",
};

export default env;
