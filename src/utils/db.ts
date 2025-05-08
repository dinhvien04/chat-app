import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || '',
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

export const testConnection = async () => {
    try {
        await sql.connect(config);
        console.log('Database connection successful!');
        return true;
    } catch (err) {
        console.error('Database connection error:', err);
        return false;
    }
};

export const getConnection = async () => {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
}; 