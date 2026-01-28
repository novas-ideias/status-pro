
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const Login: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/admin',
        },
      });
      setLoading(false);
      if (error) {
        alert('Erro ao enviar link: ' + error.message);
      } else {
        setSent(true);
      }
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-[480px] flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">mark_email_read</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white">Verifique seu e-mail</h2>
          <p className="text-[#617589] dark:text-gray-400">
            Enviamos um link de acesso para <strong>{email}</strong>.
            <br />Clique no link para entrar no Status Pro.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-primary font-bold hover:underline"
          >
            Tentar outro e-mail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-[480px] flex flex-col items-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-5xl">auto_awesome</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-background-dark dark:text-white">Status Pro</h1>
        </div>

        <div className="w-full">
          <div className="w-full h-44 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-primary/20 text-9xl">alternate_email</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-[#111418] dark:text-white tracking-tight text-2xl font-bold leading-tight px-2">
            Acesse sua conta para atualizar seus posts do Status
          </h3>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="flex flex-col w-full">
            <label className="flex flex-col w-full">
              <p className="text-[#111418] dark:text-gray-300 text-sm font-semibold leading-normal pb-2 ml-4">E-mail</p>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">mail</span>
                </div>
                <input
                  className="form-input block w-full pl-12 pr-4 h-14 rounded-full text-[#111418] dark:text-white border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1c2632] focus:border-primary transition-all placeholder:text-[#617589] text-base font-normal"
                  placeholder="Seu e-mail profissional"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary text-white text-lg font-bold leading-normal tracking-wide shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            <span className="truncate">Enviar link de acesso</span>
            <span className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
          </button>

          <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal text-center pt-2">
            Você receberá um link no e-mail para entrar
          </p>
        </form>

        <button className="text-primary text-sm font-semibold hover:underline">
          Precisa de ajuda com o acesso?
        </button>
      </div>
    </div>
  );
};

export default Login;
