import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Route test kết nối MySQL
app.get('/api/ping', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1');
        res.json({ ok: true, result: rows });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// TODO: Thêm các route đăng ký, đăng nhập ở đây

app.listen(3001, () => {
    console.log('Backend server running on port 3001');
}); 