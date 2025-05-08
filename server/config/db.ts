import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),    // ví dụ: 'localhost'
    user: process.env.DB_USER,      // ví dụ: 'root'
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Hàm test kết nối
export const testDbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        console.log('✅ Kết nối MySQL thành công!');
        connection.release();
    } catch (err) {
        console.error('❌ Kết nối MySQL thất bại:', err);
    }
};

export default pool; 