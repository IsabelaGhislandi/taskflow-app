import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, errors } = useAuth();
  const { formData, handleChange } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      alert('Senhas não coincidem');
      return;
    }

    if (formData.password.length < 8) {
      alert('Senha deve ter pelo menos 8 caracteres');
      return;
    }

    await register({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      password_confirm: formData.password_confirm
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">✨ TaskFlow</h1>
          <p className="text-emerald-200">Junte-se à revolução da produtividade</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Criar Nova Conta 🚀
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mostrar erros */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm">{error}</p>
                ))}
              </div>
            )}

            {/* Primeiro Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primeiro Nome
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                placeholder="Seu primeiro nome"
              />
            </div>

            {/* Sobrenome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sobrenome
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                placeholder="Seu sobrenome"
              />
            </div>

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
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                placeholder="Confirme sua senha"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-semibold py-3 px-6 rounded-lg transform transition-all duration-200 shadow-lg ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-[1.02]'
              } text-white`}
            >
              {isLoading ? 'Criando...' : 'Criar Conta ✨'}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Ao criar uma conta, você concorda com nossos{' '}
            <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
              Termos de Uso
            </span>
          </p>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Já tem conta?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};