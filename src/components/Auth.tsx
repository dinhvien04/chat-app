import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const response = await axios.post(endpoint, formData);

            // Lưu token vào localStorage
            localStorage.setItem('token', response.data.token);

            // Chuyển hướng đến trang chat
            navigate('/chat');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                    </button>
                </form>

                <div className="auth-switch">
                    {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                    <button
                        className="switch-button"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Đăng ký' : 'Đăng nhập'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth; 