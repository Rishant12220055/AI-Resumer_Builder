// Environment configuration
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_FRONTEND_URL: string;
    }
  }
}

export const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://ai-resumer-builder-backend.vercel.app/api',
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ai-resumer-builder.vercel.app',
};

export default config;
