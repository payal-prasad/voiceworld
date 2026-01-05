// src/config/dbConfig.js
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const jsonPath = path.join(__dirname, '../../config.json');
let json = {};

if (fs.existsSync(jsonPath)) {
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  json = raw[env] || raw.development;
}

module.exports = {
  host: process.env.DB_HOST || json.host,
  port: Number(process.env.DB_PORT) || json.port,
  database: process.env.DB_NAME || json.database,
  username: process.env.DB_USER || json.username,
  password: process.env.DB_PASSWORD || json.password,
  dialect: process.env.DB_DIALECT || json.dialect,
  logging: process.env.NODE_ENV === 'development',
};