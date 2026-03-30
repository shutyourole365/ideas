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
const PERSIST_ENABLED_KEY = 'platform_tokens_persist_enabled';

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
    if (typeof window !== 'undefined') {
      if (enabled) {
        // Save the persistEnabled state
        localStorage.setItem(PERSIST_ENABLED_KEY, 'true');
        // When enabling, sync all current tokens to localStorage
        const tokens = get().tokens;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
      } else {
        // When disabling, remove persistence flag and stored tokens
        localStorage.removeItem(PERSIST_ENABLED_KEY);
        localStorage.removeItem(STORAGE_KEY);
      }
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
      const persistFlagExists = localStorage.getItem(PERSIST_ENABLED_KEY) !== null;

      // Check if tokens exist in storage for backward compatibility
      const hasExistingTokens = stored && Object.values(safeJsonParse(stored)).some((value) => value);

      // Restore persistEnabled: if flag exists use it, otherwise infer from existing tokens
      const persistEnabled = persistFlagExists
        ? localStorage.getItem(PERSIST_ENABLED_KEY) === 'true'
        : hasExistingTokens;

      set({ persistEnabled });

      // Load tokens if persistence was enabled OR if tokens exist (backward compat)
      if (persistEnabled && stored) {
        const parsed = safeJsonParse(stored);
        if (Object.keys(parsed).length > 0) {
          set({ tokens: { ...get().tokens, ...parsed } });
        }
      }
    }
  },
}));
