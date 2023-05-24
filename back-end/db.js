//Description: This file is used to connect to the postgresql database

const { Pool } = require('pg');
//

const db = new Pool({
    user: 'wvt',
    host: 'localhost',
    port: 5007,
    database: 'wvt',
    password: '666wvt'
});

module.exports = db;