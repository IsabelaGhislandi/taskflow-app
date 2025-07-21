// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthContext();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">✨ TaskFlow</h1>
          <p className="text-emerald-200">Bem-vindo de volta!</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Fazer Login 🔐
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                placeholder="Sua senha"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-semibold py-3 px-6 rounded-lg transform transition-all duration-200 shadow-lg ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-[1.02]'
              } text-white`}
            >
              {isLoading ? 'Entrando...' : 'Entrar 🚀'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-6">
            Não tem conta?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};