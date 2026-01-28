
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Post } from '../types';

const PostSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post as Post;

  if (!post) {
    navigate('/admin');
    return null;
  }

  return (
    <Layout>
      <div className="flex grow flex-col items-center justify-center p-6">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <span className="material-symbols-outlined text-primary !text-6xl material-symbols-fill">check_circle</span>
        </div>
        
        <h1 className="text-[#111418] dark:text-white tracking-tight text-2xl font-bold text-center pb-3">
          Post publicado com sucesso
        </h1>

        <div className="w-full max-w-xs p-4">
          <div className="flex flex-col rounded-2xl shadow-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div 
              className="w-full aspect-video bg-cover bg-center" 
              style={{ backgroundImage: `url(${post.imageUrl})` }}
            ></div>
            <div className="p-4">
              <p className="text-primary text-[10px] font-bold uppercase tracking-wider mb-1">Publicado</p>
              <p className="text-[#111418] dark:text-white text-lg font-bold leading-tight">{post.title}</p>
              <p className="text-[#617589] dark:text-gray-400 text-xs mt-1 line-clamp-1">{post.description}</p>
            </div>
          </div>
        </div>

        <div className="max-w-xs pt-4 pb-12">
          <p className="text-[#617589] dark:text-gray-400 text-base text-center leading-relaxed">
            Agora é só postar normalmente no Status do WhatsApp e manter o link do Status Pro.
          </p>
        </div>

        <div className="w-full max-w-xs px-4">
          <button 
            onClick={() => navigate('/admin')}
            className="flex w-full cursor-pointer items-center justify-center rounded-full h-14 bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold"
          >
            Voltar para o painel
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PostSuccess;
