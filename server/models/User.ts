import { query } from '../config/db';
import bcrypt from 'bcrypt';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
}

export class UserModel {
    static async create(username: string, email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query(
            'INSERT INTO Users (username, email, password) VALUES (@param0, @param1, @param2); SELECT SCOPE_IDENTITY() as id;',
            [username, email, hashedPassword]
        );
        return result.recordset[0];
    }

    static async findByEmail(email: string): Promise<User | null> {
        const result = await query(
            'SELECT * FROM Users WHERE email = @param0',
            [email]
        );
        return result.recordset[0] || null;
    }

    static async findById(id: number): Promise<User | null> {
        const result = await query(
            'SELECT * FROM Users WHERE id = @param0',
            [id]
        );
        return result.recordset[0] || null;
    }

    static async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
} 