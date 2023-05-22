//Description: This file is used to connect to the postgresql database

const { Pool } = require('pg');
//

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 8010,
    database: 'postgres',
    password: '666'
});

module.exports = db;