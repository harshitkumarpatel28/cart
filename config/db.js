const env = require('dotenv').config().parsed;
const Sequelize = require("sequelize");
module.exports = new Sequelize(
 env.DB_NAME,
 env.DB_USERNAME,
 env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    dialect: env.DB_DIALECT
  }
);