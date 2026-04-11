// src/vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_APP_VERSION?: string;

  readonly VITE_API_BASE_URL?: string;
  readonly VITE_AUTH_STORAGE_KEY?: string;
  readonly VITE_TOKEN_STORAGE_KEY?: string;

  readonly VITE_ENABLE_MOCK_API?: string;
  readonly VITE_ENABLE_DEBUG_LOGS?: string;

  readonly VITE_RAZORPAY_KEY_ID?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;

  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}