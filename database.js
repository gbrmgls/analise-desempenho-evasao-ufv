require('dotenv').config();
require('sqlite3')

const knex = require("knex")({
    // client: "mysql",
    client: "sqlite3",
    connection:
    {
        filename: "./dbName.db"
        // host: process.env.DB_HOST || "db4free.net:3306",
        // user: process.env.DB_USER || "trab_final_bd",
        // password: process.env.DB_PASSWORD || "TrabFinalBD2021",
        // database: process.env.DB_NAME || "dbName"
    },
    useNullAsDefault: true
})

// knex.raw("PRAGMA foreign_keys = ON")

module.exports = knex;
