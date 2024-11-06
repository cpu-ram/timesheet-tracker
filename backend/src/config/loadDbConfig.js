import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const dbConfig = {
  dbUser: String(process.env.DB_USERNAME),
  dbPassword: String(process.env.DB_PASSWORD),
  dbHost: String(process.env.DB_HOST),
  dbName: String(process.env.DB_NAME),
  dbPort: Number(process.env.DB_PORT),
};

export default dbConfig;
