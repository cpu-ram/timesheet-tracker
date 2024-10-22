import pkg from 'pg'
import dbConfig from './loadDbConfig.js';

const { Pool } = pkg;

const dbPool = new Pool({
  user: dbConfig.dbUser,
  password: dbConfig.dbPassword,
  host: dbConfig.dbHost,
  database: dbConfig.dbName,
  port: dbConfig.dbPort,

});

export default dbPool;
