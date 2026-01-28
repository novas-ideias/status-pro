
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Post, PostStatus, BusinessProfile } from '../types';

import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    // 1. Get Business
    const { data: businessData } = await supabase
      .from('business')
      .select('*')
      .eq('email', user?.email)
      .maybeSingle();

    if (!businessData) {
      // Redirect to settings if no business found
      navigate('/settings');
      return;
    }

    setBusiness(businessData);

    // 2. Get Posts
    fetchPosts(businessData.id);
  };

  const fetchPosts = async (businessId: string) => {
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false }); // Sort by newest

    if (postsData) {
      const formattedPosts: Post[] = postsData.map(p => ({
        id: p.id,
        title: p.title,
        description: p.caption,
        imageUrl: p.media_url,
        createdAt: new Date(p.created_at).getTime(), // Convert to timestamp for compatibility
        status: p.is_active ? PostStatus.ACTIVE : PostStatus.PAUSED,
        isNew: false, // Logic for new/offer can be added later or computed
        isOffer: false
      }));
      setPosts(formattedPosts);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      await supabase.from('posts').delete().eq('id', id);
      if (business) fetchPosts(business.id as string);
    }
  };

  const toggleStatus = async (id: string, current: PostStatus) => {
    const isActive = current === PostStatus.ACTIVE;
    await supabase
      .from('posts')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (business) fetchPosts(business.id as string);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <Layout>
      <header className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="text-primary flex size-10 shrink-0 items-center justify-center bg-primary/10 rounded-xl">
            <span className="material-symbols-outlined">dashboard</span>
          </div>
          <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Status Pro</h2>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-[#617589] dark:text-gray-400" onClick={() => navigate('/settings')}>
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div
            onClick={() => navigate('/feed')}
            className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img className="w-full h-full object-cover" src={business?.logoUrl || "https://picsum.photos/seed/shop/200/200"} alt="Logo" />
          </div>
        </div>
      </header>


      <div className="px-4 py-4">
        <h3 className="text-[#111418] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Posts Recentes</h3>
        <p className="text-[#617589] dark:text-gray-400 text-sm">Monitore e modere suas atualizações recentes</p>
      </div>

      <main className="flex-1 pb-24 px-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex flex-[2_2_0px] flex-col justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${post.status === PostStatus.ACTIVE ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                  <p className="text-[#617589] dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    {post.status === PostStatus.ACTIVE ? 'Ativo' : 'Pausado'}
                  </p>
                </div>
                <p className="text-[#111418] dark:text-white text-base font-bold leading-tight line-clamp-2">{post.title}</p>
                <p className="text-[#617589] dark:text-gray-400 text-xs font-normal">
                  {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •
                  {new Date(post.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ? ' Hoje' : ' Ontem'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(post.id, post.status)}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 bg-primary text-white gap-1 text-xs font-bold leading-normal w-fit transition-colors hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {post.status === PostStatus.ACTIVE ? 'pause' : 'play_arrow'}
                  </span>
                  <span className="truncate">{post.status === PostStatus.ACTIVE ? 'Pausar' : 'Ativar'}</span>
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-background-light dark:bg-gray-800 text-[#111418] dark:text-white hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
            <div
              className="w-32 bg-center bg-no-repeat aspect-square bg-cover rounded-xl shrink-0"
              style={{ backgroundImage: `url(${post.imageUrl})` }}
            ></div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">post_add</span>
            <p className="text-lg font-bold">Nenhum post ainda</p>
            <p className="text-sm">Crie seu primeiro post no botão abaixo</p>
          </div>
        )}
      </main>

      <button
        onClick={() => navigate('/new-post')}
        className="fixed bottom-8 right-1/2 translate-x-1/2 md:translate-x-0 md:right-8 flex h-14 min-w-[160px] items-center justify-center gap-2 rounded-full bg-primary px-8 text-white shadow-xl hover:scale-105 active:scale-95 transition-all z-[60]"
      >
        <span className="material-symbols-outlined font-bold">add</span>
        <span className="font-bold text-base">Novo post</span>
      </button>

      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 dark:bg-gray-700 rounded-full opacity-50 md:hidden"></div>
    </Layout>
  );
};

export default AdminDashboard;
