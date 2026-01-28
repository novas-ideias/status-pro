
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PostStatus } from '../types';

import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const NewPost: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!title || !description || !user) return;
    setIsSubmitting(true);

    // 1. Get Business ID
    const { data: business } = await supabase
      .from('business')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!business) {
      alert('Erro: Negócio não encontrado.');
      setIsSubmitting(false);
      return;
    }

    // 2. Create Post
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        business_id: business.id,
        title,
        caption: description,
        media_url: image || `https://picsum.photos/seed/${Date.now()}/800/1000`,
        media_type: 'image',
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      alert('Erro ao publicar: ' + error.message);
      setIsSubmitting(false);
      return;
    }

    const newPost = {
      id: data.id,
      title: data.title,
      description: data.caption,
      imageUrl: data.media_url,
      createdAt: new Date(data.created_at).getTime(),
      status: PostStatus.ACTIVE,
      isNew: true
    };

    navigate('/post-success', { state: { post: newPost } });
  };

  return (
    <Layout>
      <header className="sticky top-0 z-10 flex items-center bg-white/80 dark:bg-[#111418]/80 backdrop-blur-md p-4 justify-between border-b border-[#dbe0e6] dark:border-[#2a3037]">
        <button
          onClick={() => navigate(-1)}
          className="text-[#111418] dark:text-white flex size-10 shrink-0 items-center justify-start cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Novo post</h2>
      </header>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="p-4">
          <label className="flex flex-col items-center gap-6 rounded-2xl border-2 border-dashed border-[#dbe0e6] dark:border-[#3b444c] bg-background-light/30 dark:bg-background-dark/30 px-6 py-10 transition-colors hover:bg-background-light/50 dark:hover:bg-background-dark/50 cursor-pointer overflow-hidden relative group">
            {image ? (
              <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
            ) : (
              <>
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined !text-4xl">add_a_photo</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[#111418] dark:text-white text-lg font-bold">Adicionar foto ou vídeo</p>
                  <p className="text-[#617589] dark:text-[#9ba8b6] text-sm text-center">Toque para fazer upload de mídia para o seu status</p>
                </div>
              </>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            {image && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                Trocar Imagem
              </div>
            )}
          </label>
        </div>

        <div className="px-4 py-3 space-y-4">
          <label className="flex flex-col w-full">
            <p className="text-[#111418] dark:text-white text-base font-semibold pb-2">Título do Post</p>
            <input
              className="form-input flex w-full rounded-xl text-[#111418] dark:text-white border border-[#dbe0e6] dark:border-[#3b444c] bg-white dark:bg-[#1a1f24] p-4 text-base"
              placeholder="Ex: Nova Coleção de Verão"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="flex flex-col w-full">
            <div className="flex items-center justify-between pb-2">
              <p className="text-[#111418] dark:text-white text-base font-semibold">Texto do Status</p>
              <span className="text-[#617589] text-xs font-normal">Opcional</span>
            </div>
            <textarea
              className="form-input flex w-full resize-none rounded-xl text-[#111418] dark:text-white border border-[#dbe0e6] dark:border-[#3b444c] bg-white dark:bg-[#1a1f24] min-h-[160px] placeholder:text-[#617589] p-4 text-base leading-relaxed"
              placeholder="O que você está pensando? Escreva aqui..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>

          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#617589] !text-lg mt-0.5">info</span>
            <p className="text-[#617589] dark:text-[#9ba8b6] text-sm leading-normal">
              Esse post ficará visível publicamente no link do Status Pro para todos os seus seguidores.
            </p>
          </div>
        </div>

        <div className="flex-1"></div>

        <div className="sticky bottom-0 bg-white/95 dark:bg-[#111418]/95 backdrop-blur-sm p-4 border-t border-[#dbe0e6] dark:border-[#2a3037]">
          <button
            onClick={handlePublish}
            disabled={!title || !description || isSubmitting}
            className="flex w-full cursor-pointer items-center justify-center rounded-full h-14 bg-primary text-white text-lg font-bold shadow-lg disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
          <div className="h-4"></div>
        </div>
      </div>
    </Layout>
  );
};

export default NewPost;
