import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default db;
