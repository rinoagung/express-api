const { Client } = require('pg');
require('dotenv').config();

// local
const dbConfig = {
    user: process.env.POSTGRES_USERNAME,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
};

// const dbConfig = {
//     connectionString: process.env.POSTGRES_URL,
// };

const runQuery = async (query, values = []) => {
    const client = new Client(dbConfig);
    await client.connect();
    const result = await client.query(query, values);
    await client.end();
    return result;
};

module.exports = runQuery;
