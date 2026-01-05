const { Sequelize } = require('sequelize');
const config = require('./index');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,          // 'postgres' or 'mysql'
    logging: config.db.logging ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: config.db.dialect === 'mysql' ? { decimalNumbers: true } : {},
  }
);

module.exports = sequelize;
