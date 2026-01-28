
import { Post, PostStatus, BusinessProfile } from './types';

export const INITIAL_BUSINESS: BusinessProfile = {
  name: "Loja do João",
  bio: "Gerencie seus status de forma profissional e rápida com o Status Pro.",
  logoUrl: "https://picsum.photos/seed/shop/200/200",
  whatsapp: "(99) 99999-9999",
  email: "admin@statuspro.com.br",
  isVerified: true,
  theme: 'light',
};

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Confira nossa nova coleção de verão! ☀️',
    description: 'Temos diversos tamanhos e cores disponíveis para entrega imediata.',
    imageUrl: 'https://picsum.photos/seed/fashion/800/1000',
    createdAt: Date.now() - 1000 * 60 * 15,
    status: PostStatus.ACTIVE,
    isNew: true,
  },
  {
    id: '2',
    title: 'Novidades na vitrine de hoje!',
    description: 'Venha conferir nossos acessórios exclusivos. Edição limitada!',
    imageUrl: 'https://picsum.photos/seed/accessories/800/1000',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    status: PostStatus.ACTIVE,
  },
  {
    id: '3',
    title: 'Últimas unidades em promoção',
    description: 'Descontos de até 30% enquanto durar o estoque. Aproveite!',
    imageUrl: 'https://picsum.photos/seed/sale/800/1000',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    status: PostStatus.ACTIVE,
    isOffer: true,
  }
];
