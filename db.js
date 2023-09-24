const pgp = require('pg-promise')();

const dbConfig = {
  user: 'postgres',
  password: 'taaha12',
  host: 'localhost',
  port: 5432, // Default PostgreSQL port
  database: 'social media',
};

const db = pgp(dbConfig);

// Export the db instance for reuse
module.exports = db;
