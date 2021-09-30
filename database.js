require('dotenv').config();
require('sqlite3')

const knex = require("knex")({
    // client: "mysql2",
    client: "sqlite3",
    connection:
    {
        filename: "./dbName.db"
        // host: process.env.DB_HOST || "localhost",
        // user: process.env.DB_USER || "root",
        // password: process.env.DB_PASSWORD || "",
        // database: process.env.DB_NAME || "dbName"
    },
    useNullAsDefault: true
})

knex.raw("PRAGMA foreign_keys = ON")

module.exports = knex;
