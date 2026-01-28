
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { storageService } from '../services/storageService';
import { Post, BusinessProfile, PostStatus } from '../types';

const PublicFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(storageService.getPosts().filter(p => p.status === PostStatus.ACTIVE));
    setBusiness(storageService.getBusiness());
  }, []);

  if (!business) return null;

  return (
    <div data-theme={business.theme} className={`contents ${business.theme === 'dark' ? 'dark' : ''}`}>
      <Layout className="bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center p-4 justify-between">
            <div className="flex size-10 shrink-0 items-center">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm border-2 border-primary/10"
                style={{ backgroundImage: `url(${business.logoUrl})` }}
              ></div>
            </div>
            <div className="flex-1 px-3">
              <h1 className="text-[#111418] dark:text-white text-base font-bold leading-tight flex items-center gap-1">
                {business.name}
                <span className="material-symbols-outlined material-symbols-fill text-primary text-[16px]">verified</span>
              </h1>
              <p className="text-[#617589] dark:text-gray-400 text-xs">Online agora</p>
            </div>
            <button className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="flex flex-col items-center py-8 px-6 gap-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 ring-4 ring-primary ring-offset-2 dark:ring-offset-background-dark shadow-xl mb-2"
              style={{ backgroundImage: `url(${business.logoUrl})` }}
            ></div>
            <h2 className="text-[#111418] dark:text-white text-2xl font-extrabold text-center tracking-tight">{business.name}</h2>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-medium text-center max-w-xs">{business.bio}</p>
          </div>

          <div className="flex flex-col gap-6 pb-32">
            {posts.map((post) => (
              <div key={post.id} className="px-4">
                <div className="flex flex-col rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover relative"
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                  >
                    <div className="absolute top-4 left-4 flex gap-2">
                      {post.isNew && (
                        <span className="bg-primary/20 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Novo</span>
                      )}
                      {post.isOffer && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Oferta</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 py-5 px-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-tight">{post.title}</p>
                      <p className="text-[#617589] dark:text-gray-400 text-sm leading-relaxed">{post.description}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="material-symbols-outlined text-gray-400 text-[14px]">schedule</span>
                        <p className="text-[#617589] dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                          Postado em {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/confirm-attendance', { state: { post } })}
                      className="flex w-full cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 transition-transform active:scale-95"
                    >
                      <span className="material-symbols-outlined mr-2">chat</span>
                      Perguntar sobre este post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex justify-center z-50">
          <div className="w-full max-w-[480px] flex gap-3">
            <a
              href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center h-12 bg-whatsapp text-white rounded-full font-bold shadow-lg shadow-green-200 dark:shadow-none transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined mr-2">call</span>
              Chamar no WhatsApp
            </a>
            <button className="flex size-12 items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full text-[#111418] dark:text-white">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </footer>
      </Layout>
    </div>
  );
};

export default PublicFeed;
