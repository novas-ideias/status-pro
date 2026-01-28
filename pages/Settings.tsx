
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { INITIAL_BUSINESS } from '../constants';
import { BusinessProfile } from '../types';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadBusiness();
    }
  }, [user]);

  const loadBusiness = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('business')
      .select('*')
      .eq('email', user?.email)
      .single();

    if (data) {
      setProfile(data);
    } else {
      // Initialize with defaults if no business found
      setProfile({
        ...INITIAL_BUSINESS,
        email: user?.email || '',
        name: '',
        whatsapp: '',
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    if (!profile.name || !profile.whatsapp) {
      alert('Por favor, preencha o Nome e o WhatsApp.');
      return;
    }

    setLoading(true);

    const businessData = {
      name: profile.name,
      whatsapp_number: profile.whatsapp,
      email: user.email,
      logo_url: profile.logoUrl,
      theme: profile.theme,
    };

    // Check if updating or creating
    const { data: existing } = await supabase
      .from('business')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from('business')
        .update(businessData)
        .eq('id', existing.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('business')
        .insert([businessData]);
      error = result.error;
    }

    setLoading(false);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      alert('Configurações salvas!');
      navigate('/admin');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ideally upload to storage, for MVP keep base64 or similar logic? 
    // Wait, the prompt says "Logo (upload opcional)". 
    // Given MVP constraints and "NO RLS" on storage mentions, let's keep it simple.
    // However, saving full base64 in TEXT field might fail if too large.
    // Let's stick to the existing FileReader logic but be aware it might hit limits.
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyLink = () => {
    const link = window.location.origin;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copiado para a área de transferência!');
    });
  };

  if (!profile && loading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!profile) return null;

  return (
    <Layout>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between">
          <button onClick={() => navigate(-1)} className="text-[#111418] dark:text-white flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <h2 className="text-[#111418] dark:text-white text-lg font-bold flex-1 text-center">Configurações</h2>
          <div className="flex w-12 items-center justify-end">
            <button onClick={handleSave} disabled={loading} className="text-primary text-base font-bold hover:opacity-80 transition-opacity disabled:opacity-50">
              {loading ? '...' : 'Salvar'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-10">
        {/* ... (rest of the UI remains the same, just verify bindings) ... */}
        <section className="mt-4">
          <div className="px-4 py-2">
            <h3 className="text-[#111418] dark:text-white text-lg font-bold">Perfil do Negócio</h3>
          </div>
          {/* ... */}


          <div className="px-4 py-3">
            <label className="flex flex-col w-full">
              <p className="text-[#111418] dark:text-gray-300 text-sm font-medium pb-2">Nome do Negócio</p>
              <input
                className="form-input flex w-full rounded-xl text-[#111418] dark:text-white border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-14 p-4 text-base"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </label>
          </div>

          <div className="px-4 py-3">
            <label className="flex flex-col w-full">
              <p className="text-[#111418] dark:text-gray-300 text-sm font-medium pb-2">Bio curta</p>
              <textarea
                className="form-input flex w-full rounded-xl text-[#111418] dark:text-white border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 min-h-32 p-4 text-base resize-none"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </label>
          </div>

          <div className="px-4 py-3">
            <p className="text-[#111418] dark:text-gray-300 text-sm font-medium pb-2">Logotipo do Negócio</p>
            <div className="flex items-center gap-4 p-4 border border-[#dbe0e6] dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
              <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 overflow-hidden shrink-0">
                <img src={profile.logoUrl} className="w-full h-full object-cover" alt="Logo" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-primary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">
                  <span className="material-symbols-outlined text-lg">add_a_photo</span>
                  Adicionar logo
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                </label>
                <p className="text-xs text-[#617589]">Recomendado: 512x512px (PNG ou JPG)</p>
              </div>
            </div>
          </div>


          <div className="px-4 py-3">
            <p className="text-[#111418] dark:text-gray-300 text-sm font-medium pb-2">Tema visual da página pública</p>
            <div className="grid grid-cols-3 gap-3">
              {/* Tema Claro */}
              <div
                onClick={() => setProfile({ ...profile, theme: 'light' })}
                className={`relative cursor-pointer rounded-xl border-2 p-3 transition-all ${profile.theme === 'light' ? 'border-primary bg-blue-50/50 dark:bg-blue-900/10' : 'border-[#dbe0e6] dark:border-gray-700 hover:border-gray-300'}`}
              >
                <div className="aspect-[4/5] bg-[#f6f7f8] rounded-lg mb-2 border border-gray-200 shadow-sm flex flex-col gap-1 p-1 overflow-hidden">
                  <div className="h-2 w-full bg-white rounded-full"></div>
                  <div className="h-8 w-full bg-white rounded-md mt-1"></div>
                  <div className="flex gap-1 mt-1">
                    <div className="h-10 w-full bg-white rounded-md"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`size-4 rounded-full border flex items-center justify-center ${profile.theme === 'light' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                    {profile.theme === 'light' && <div className="size-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="text-sm font-bold text-[#111418] dark:text-white">Claro</span>
                </div>
              </div>

              {/* Tema Escuro */}
              <div
                onClick={() => setProfile({ ...profile, theme: 'dark' })}
                className={`relative cursor-pointer rounded-xl border-2 p-3 transition-all ${profile.theme === 'dark' ? 'border-primary bg-blue-50/50 dark:bg-blue-900/10' : 'border-[#dbe0e6] dark:border-gray-700 hover:border-gray-300'}`}
              >
                <div className="aspect-[4/5] bg-[#101922] rounded-lg mb-2 border border-gray-800 shadow-sm flex flex-col gap-1 p-1 overflow-hidden">
                  <div className="h-2 w-full bg-gray-800 rounded-full"></div>
                  <div className="h-8 w-full bg-gray-800 rounded-md mt-1"></div>
                  <div className="flex gap-1 mt-1">
                    <div className="h-10 w-full bg-gray-800 rounded-md"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`size-4 rounded-full border flex items-center justify-center ${profile.theme === 'dark' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                    {profile.theme === 'dark' && <div className="size-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="text-sm font-bold text-[#111418] dark:text-white">Escuro</span>
                </div>
              </div>

              {/* Tema Boutique */}
              <div
                onClick={() => setProfile({ ...profile, theme: 'boutique' })}
                className={`relative cursor-pointer rounded-xl border-2 p-3 transition-all ${profile.theme === 'boutique' ? 'border-primary bg-blue-50/50 dark:bg-blue-900/10' : 'border-[#dbe0e6] dark:border-gray-700 hover:border-gray-300'}`}
              >
                <div className="aspect-[4/5] bg-[#f0eee9] rounded-lg mb-2 border border-[#e6e2db] shadow-sm flex flex-col gap-1 p-1 overflow-hidden">
                  <div className="h-2 w-full bg-[#fffaf5] rounded-full"></div>
                  <div className="h-8 w-full bg-[#fffaf5] rounded-md mt-1 border border-[#e6e2db]"></div>
                  <div className="flex gap-1 mt-1">
                    <div className="h-10 w-full bg-[#fffaf5] rounded-md border border-[#e6e2db]"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`size-4 rounded-full border flex items-center justify-center ${profile.theme === 'boutique' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                    {profile.theme === 'boutique' && <div className="size-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="text-sm font-bold text-[#111418] dark:text-white">Boutique</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#617589] mt-3">Esse tema será exibido para seus clientes ao acessar o link do Status Pro.</p>
          </div>
        </section>

        <div className="h-4 bg-background-light dark:bg-gray-900/50 mt-4"></div>

        <section className="mt-4">
          <div className="px-4 py-2">
            <h3 className="text-[#111418] dark:text-white text-lg font-bold">Informações de Contato</h3>
          </div>

          <div className="px-4 py-3">
            <label className="flex flex-col w-full">
              <p className="text-[#111418] dark:text-gray-300 text-sm font-medium pb-2">Número do WhatsApp</p>
              <input
                className="form-input flex w-full rounded-xl text-[#111418] dark:text-white border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-14 p-4 text-base"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              />
            </label>
          </div>

          <div className="px-4 py-3">
            <label className="flex flex-col w-full opacity-70">
              <p className="text-[#111418] dark:text-gray-300 text-sm font-medium pb-2">E-mail de Acesso</p>
              <input
                className="form-input flex w-full rounded-xl text-[#617589] border border-[#dbe0e6] dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 h-14 p-4 text-base cursor-not-allowed"
                disabled
                value={profile.email}
              />
              <p className="text-xs text-gray-400 mt-2 italic px-1">O e-mail de acesso não pode ser alterado.</p>
            </label>
          </div>
        </section>

        <div className="h-4 bg-background-light dark:bg-gray-900/50 mt-4"></div>

        <section className="mt-4">
          <div className="px-4 py-2">
            <h3 className="text-[#111418] dark:text-white text-lg font-bold">Compartilhamento</h3>
          </div>

          <div className="px-4 py-2">
            <div className="bg-[#eff7ff] dark:bg-blue-900/20 rounded-xl p-6 flex flex-col items-center text-center border border-blue-100 dark:border-blue-800">
              <div className="bg-[#dbeafe] dark:bg-blue-800 text-[#2563eb] dark:text-blue-200 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">share</span>
              </div>

              <h4 className="text-[#111418] dark:text-white text-lg font-bold mb-2">Seu link está pronto!</h4>
              <p className="text-[#617589] dark:text-gray-300 text-sm mb-6 max-w-[280px] leading-relaxed">
                Compartilhe seu perfil profissional com seus clientes agora mesmo.
              </p>

              <button
                onClick={handleCopyLink}
                className="w-full bg-[#187bf0] hover:bg-[#1565c0] text-white font-bold h-12 rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.98] transform duration-100"
              >
                <span className="material-symbols-outlined text-xl">content_copy</span>
                Copiar link do Status Pro
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-8 px-4 pb-12 flex flex-col items-center gap-4">
          <button
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
            className="flex items-center gap-2 text-red-500 font-bold text-base hover:text-red-600 transition-colors py-2"
          >
            <span className="material-symbols-outlined">logout</span>
            Sair da conta
          </button>
          <p className="text-[10px] text-[#617589] uppercase tracking-[0.2em] font-bold">Status Pro v2.4.0</p>
        </footer>
      </main>
    </Layout >
  );
};

export default Settings;
