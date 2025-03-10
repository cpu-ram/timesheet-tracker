import pg from 'pg';
import pkg from 'pg';
import dbConfig from './loadDbConfig.js';
import { Temporal } from '@js-temporal/polyfill'

const { Pool } = pkg;

const timestampWithoutTzDataTypeId = 1114;
const dateDataTypeId = 1082;

const dbPool = new Pool({
  user: dbConfig.dbUser,
  password: dbConfig.dbPassword,
  host: dbConfig.dbHost,
  database: dbConfig.dbName,
  port: dbConfig.dbPort,
  types: {
    getTypeParser: (dataTypeID, format) => {
      if (dataTypeID === timestampWithoutTzDataTypeId) {
        return (value) => value.replace(' ', 'T');
      } else if (dataTypeID === dateDataTypeId) {
        return (value) => Temporal.PlainDate.from(value.split(' ')[0]);
      }

      return pg.types.getTypeParser(dataTypeID, format);
    }
  }

});

export default dbPool;
