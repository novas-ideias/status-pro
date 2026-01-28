
import { Post, BusinessProfile } from '../types';
import { INITIAL_BUSINESS, MOCK_POSTS } from '../constants';

const KEYS = {
  BUSINESS: 'status_pro_business',
  POSTS: 'status_pro_posts',
};

export const storageService = {
  getBusiness: (): BusinessProfile => {
    const data = localStorage.getItem(KEYS.BUSINESS);
    return data ? JSON.parse(data) : INITIAL_BUSINESS;
  },
  saveBusiness: (profile: BusinessProfile) => {
    localStorage.setItem(KEYS.BUSINESS, JSON.stringify(profile));
  },
  getPosts: (): Post[] => {
    const data = localStorage.getItem(KEYS.POSTS);
    return data ? JSON.parse(data) : MOCK_POSTS;
  },
  savePosts: (posts: Post[]) => {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  },
  addPost: (post: Post) => {
    const posts = storageService.getPosts();
    storageService.savePosts([post, ...posts]);
  },
  deletePost: (id: string) => {
    const posts = storageService.getPosts();
    storageService.savePosts(posts.filter(p => p.id !== id));
  },
  updatePostStatus: (id: string, status: Post['status']) => {
    const posts = storageService.getPosts();
    storageService.savePosts(posts.map(p => p.id === id ? { ...p, status } : p));
  }
};
