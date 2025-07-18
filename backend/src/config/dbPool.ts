import pg from 'pg';
import { Pool } from 'pg';
import dbConfig from './loadDbConfig.js';
import { Temporal } from '@js-temporal/polyfill'

const timestampWithoutTzDataTypeId = 1114;
const dateDataTypeId = 1082;

const dbPool: Pool = new Pool({
  user: dbConfig.dbUser,
  password: dbConfig.dbPassword,
  host: dbConfig.dbHost,
  database: dbConfig.dbName,
  port: dbConfig.dbPort,
  ssl:
    process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true' ?
      { rejectUnauthorized: true, }
      : false,
  types: {
    getTypeParser: (dataTypeID, format) => {
      if (dataTypeID === timestampWithoutTzDataTypeId) {
        return (value: string) => value.replace(' ', 'T');
      } else if (dataTypeID === dateDataTypeId) {
        return (value: string) => Temporal.PlainDate.from(value.split(' ')[0]);
      }

      return pg.types.getTypeParser(dataTypeID, format);
    }
  }

});

export default dbPool;
