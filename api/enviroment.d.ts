declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_CONNECTIONURL: string;
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};
