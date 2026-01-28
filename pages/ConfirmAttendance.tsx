
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { storageService } from '../services/storageService';
import { Post } from '../types';

const ConfirmAttendance: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post as Post;
  const business = storageService.getBusiness();

  if (!post) {
    navigate('/');
    return null;
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Oi! Vim do seu Status. Quero falar sobre o post "${post.title}" que vi agora há pouco.`);
    window.open(`https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div data-theme={business.theme} className={`contents ${business.theme === 'dark' ? 'dark' : ''}`}>
      <Layout>
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center p-4">
            <button onClick={() => navigate(-1)} className="text-[#111418] dark:text-white flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>
            <h2 className="text-[#111418] dark:text-white text-lg font-bold flex-1 text-center pr-10">Confirmar Atendimento</h2>
          </div>
        </header>

        <main className="flex-1 flex flex-col pb-32">
          <div className="px-6 pt-8 pb-4">
            <h3 className="text-[#111418] dark:text-white tracking-tight text-2xl font-extrabold leading-tight text-center">
              Vamos falar sobre este post no WhatsApp
            </h3>
          </div>

          <div className="px-4 py-2">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-3">
                <div className="flex flex-col gap-4">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                  ></div>
                  <div className="flex flex-col gap-1 pb-2">
                    <p className="text-[#111418] dark:text-white text-lg font-bold">{post.title}</p>
                    <p className="text-[#617589] dark:text-gray-400 text-sm leading-relaxed">{post.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 mt-6">
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm">chat_bubble</span>
                <h3 className="text-[#111418] dark:text-white text-xs font-bold uppercase tracking-wider">Preview da mensagem</h3>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm relative italic">
                <p className="text-[#111418] dark:text-white text-base font-medium">
                  "Oi! Vim do seu Status. Quero falar sobre esse post que vi agora há pouco."
                </p>
                <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 border-r border-b border-gray-50 dark:border-gray-800"></div>
              </div>
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent flex justify-center">
          <div className="w-full max-w-[480px]">
            <button
              onClick={handleWhatsApp}
              className="w-full bg-whatsapp hover:brightness-110 active:scale-[0.98] transition-all text-white h-14 rounded-full flex items-center justify-center gap-3 shadow-lg shadow-whatsapp/20"
            >
              <span className="material-symbols-outlined material-symbols-fill !text-[28px]">chat</span>
              <span className="text-lg font-bold">Ir para o WhatsApp</span>
            </button>
            <div className="h-4"></div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ConfirmAttendance;
