import { Pool } from 'pg';
import config from './config.js';

dotenv.config();

const pool = new Pool({
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost,
  database: config.dbName,
  port: config.dbPort,

});

export default pool;
