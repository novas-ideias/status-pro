
export enum PostStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  status: PostStatus;
  isOffer?: boolean;
  isNew?: boolean;
}

export interface BusinessProfile {
  name: string;
  bio: string;
  logoUrl: string;
  whatsapp: string;
  email: string;
  isVerified: boolean;
  theme?: 'light' | 'dark' | 'boutique';
}
