//Description: This file is used to connect to the postgresql database

const { Pool } = require('pg');
//

const db = new Pool({
    user: 'wvt',
    host: '148.238.2.83',
    port: 5007,
    database: 'wvt_db',
    password: '666wvt'
});

module.exports = db;