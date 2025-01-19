import pg from 'pg';
import pkg from 'pg';
import dbConfig from './loadDbConfig.js';

const { Pool } = pkg;

const timestampDataTypeId = 1114;

const dbPool = new Pool({
  user: dbConfig.dbUser,
  password: dbConfig.dbPassword,
  host: dbConfig.dbHost,
  database: dbConfig.dbName,
  port: dbConfig.dbPort,
  types: {
    getTypeParser: (dataTypeID, format) => {
      if (dataTypeID === timestampDataTypeId) {
        return (value) => value.replace(' ', 'T');
      }
      return pg.types.getTypeParser(dataTypeID, format);
    }
  }

});

export default dbPool;
