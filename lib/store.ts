import { create } from 'zustand';

export interface Tokens {
  github: string;
  vercel: string;
  [key: string]: string;
}

interface TokenStore {
  tokens: Tokens;
  setToken: (platform: string, token: string) => void;
  getToken: (platform: string) => string | null;
  loadTokens: () => void;
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  tokens: {
    github: '',
    vercel: '',
  },
  setToken: (platform: string, token: string) => {
    set((state) => ({
      tokens: { ...state.tokens, [platform]: token },
    }));
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('platform_tokens') || '{}';
      const parsed = JSON.parse(stored);
      parsed[platform] = token;
      localStorage.setItem('platform_tokens', JSON.stringify(parsed));
    }
  },
  getToken: (platform: string) => {
    const state = get();
    return state.tokens[platform] || null;
  },
  loadTokens: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('platform_tokens');
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ tokens: { ...get().tokens, ...parsed } });
      }
    }
  },
}));
