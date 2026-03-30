import { create } from 'zustand';

export interface Tokens {
  github: string;
  vercel: string;
  netlify: string;
  stripe: string;
  supabase_url: string;
  supabase_key: string;
  bolt: string;
  google_cloud: string;
  claude: string;
  datadog: string;
  datadog_app_key: string;
  sentry: string;
  linear: string;
  auth0: string;
  auth0_domain: string;
  slack: string;
  sendgrid: string;
  aws_key: string;
  aws_secret: string;
  digitalocean: string;
  mongodb_public: string;
  mongodb_private: string;
  redis: string;
  plausible: string;
  segment: string;
  vault: string;
  vault_addr: string;
  [key: string]: string;
}

interface TokenStore {
  tokens: Tokens;
  setToken: (platform: string, token: string) => void;
  getToken: (platform: string) => string | null;
  loadTokens: () => void;
  persistEnabled: boolean;
  setPersistEnabled: (enabled: boolean) => void;
}

const STORAGE_KEY = 'platform_tokens';

const safeJsonParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.warn('Failed to parse stored tokens, starting fresh:', e);
    return {};
  }
};

export const useTokenStore = create<TokenStore>((set, get) => ({
  tokens: {
    github: '',
    vercel: '',
    netlify: '',
    stripe: '',
    supabase_url: '',
    supabase_key: '',
    bolt: '',
    google_cloud: '',
    claude: '',
    datadog: '',
    datadog_app_key: '',
    sentry: '',
    linear: '',
    auth0: '',
    auth0_domain: '',
    slack: '',
    sendgrid: '',
    aws_key: '',
    aws_secret: '',
    digitalocean: '',
    mongodb_public: '',
    mongodb_private: '',
    redis: '',
    plausible: '',
    segment: '',
    vault: '',
    vault_addr: '',
  },
  persistEnabled: false,
  setPersistEnabled: (enabled: boolean) => {
    set({ persistEnabled: enabled });
    if (!enabled && typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
  setToken: (platform: string, token: string) => {
    set((state) => ({
      tokens: { ...state.tokens, [platform]: token },
    }));

    // Only persist if explicitly enabled
    if (get().persistEnabled && typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) || '{}';
      const parsed = safeJsonParse(stored);
      parsed[platform] = token;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
  },
  getToken: (platform: string) => {
    const state = get();
    return state.tokens[platform] || null;
  },
  loadTokens: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = safeJsonParse(stored);
        if (Object.keys(parsed).length > 0) {
          set({ tokens: { ...get().tokens, ...parsed } });
        }
      }
    }
  },
}));
