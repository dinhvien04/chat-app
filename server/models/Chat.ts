import { query } from '../config/db';

export interface ChatSession {
    id: number;
    user_id: number;
    title: string;
    created_at: Date;
}

export interface Message {
    id: number;
    chat_session_id: number;
    role: string;
    content: string;
    created_at: Date;
}

export class ChatModel {
    static async createSession(userId: number, title: string): Promise<ChatSession> {
        const result = await query(
            'INSERT INTO ChatSessions (user_id, title) VALUES (@param0, @param1); SELECT SCOPE_IDENTITY() as id;',
            [userId, title]
        );
        return result.recordset[0];
    }

    static async getSessionsByUserId(userId: number): Promise<ChatSession[]> {
        const result = await query(
            'SELECT * FROM ChatSessions WHERE user_id = @param0 ORDER BY created_at DESC',
            [userId]
        );
        return result.recordset;
    }

    static async getSessionById(id: number): Promise<ChatSession | null> {
        const result = await query(
            'SELECT * FROM ChatSessions WHERE id = @param0',
            [id]
        );
        return result.recordset[0] || null;
    }

    static async addMessage(chatSessionId: number, role: string, content: string): Promise<Message> {
        const result = await query(
            'INSERT INTO Messages (chat_session_id, role, content) VALUES (@param0, @param1, @param2); SELECT SCOPE_IDENTITY() as id;',
            [chatSessionId, role, content]
        );
        return result.recordset[0];
    }

    static async getMessagesBySessionId(chatSessionId: number): Promise<Message[]> {
        const result = await query(
            'SELECT * FROM Messages WHERE chat_session_id = @param0 ORDER BY created_at ASC',
            [chatSessionId]
        );
        return result.recordset;
    }

    static async deleteSession(id: number): Promise<void> {
        await query(
            'DELETE FROM Messages WHERE chat_session_id = @param0; DELETE FROM ChatSessions WHERE id = @param0;',
            [id]
        );
    }
} 