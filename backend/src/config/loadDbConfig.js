import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const dbConfig = {
  dbHost: String(process.env.DB_HOST),
  dbPort: Number(process.env.DB_PORT),
  dbName: String(process.env.DB_NAME),
  dbUser: String(process.env.DB_USERNAME),
  dbPassword: String(process.env.DB_PASSWORD),
};

export default dbConfig;
