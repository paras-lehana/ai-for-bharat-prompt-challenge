import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const DevTools = () => {
    const { login, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (phone, role) => {
        setLoading(true);
        try {
            // 1. Send OTP
            await authAPI.sendOTP(phone);

            // 2. Verify OTP
            const response = await authAPI.verifyOTP(phone, '1104', { role });

            // 3. Login
            login(response.data.token, response.data.user);
            navigate('/');
            setIsOpen(false);
        } catch (error) {
            console.error('DevTools Login Error:', error);
            alert('Login failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999]">
            {isOpen ? (
                <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 w-64">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Dev Tools</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>

                    <div className="space-y-2">
                        <div className="text-xs text-gray-500 mb-2">
                            Current: {user ? `${user.name} (${user.role})` : 'Not Logged In'}
                        </div>

                        <button
                            onClick={() => handleLogin('+919876543210', 'vendor')}
                            disabled={loading}
                            className="w-full bg-green-100 text-green-800 px-3 py-2 rounded text-sm font-medium hover:bg-green-200 disabled:opacity-50"
                        >
                            Login as Farmer 🌾
                        </button>

                        <button
                            onClick={() => handleLogin('+919876543212', 'buyer')}
                            disabled={loading}
                            className="w-full bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm font-medium hover:bg-blue-200 disabled:opacity-50"
                        >
                            Login as Buyer 🛒
                        </button>

                        <button
                            onClick={() => { logout(); navigate('/login'); setIsOpen(false); }}
                            className="w-full bg-red-100 text-red-800 px-3 py-2 rounded text-sm font-medium hover:bg-red-200"
                        >
                            Logout 🚪
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition"
                    title="Open Dev Tools"
                >
                    🛠️
                </button>
            )}
        </div>
    );
};

export default DevTools;
