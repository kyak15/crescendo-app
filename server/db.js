import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()
const { Pool } = pg;

let pool;

if(process.env.NODE_ENV === 'dev' ||process.env.NODE_ENV === 'test'){
    pool = new Pool({
        user: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        host: process.env.TEST_DB_HOST,
        port: process.env.TEST_DB_PORT,
        database: process.env.TEST_DB_NAME
    })
} else{
    console.log('not test')
    pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: 'db',
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    })
}

export default pool;
