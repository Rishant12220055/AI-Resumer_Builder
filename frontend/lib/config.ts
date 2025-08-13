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
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV === 'development' ? 
      (process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000/api') : 
      'https://ai-resumer-builder-backend.vercel.app/api'),
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ai-resumer-builder.vercel.app'),
};

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Config Debug:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_URL_LOCAL: process.env.NEXT_PUBLIC_API_URL_LOCAL,
    API_BASE_URL: config.API_BASE_URL,
    FRONTEND_URL: config.FRONTEND_URL
  });
}

export default config;
