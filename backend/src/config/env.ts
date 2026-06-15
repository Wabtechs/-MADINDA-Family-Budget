import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET non défini — utiliser une clé forte en production !');
}
if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'madinda123') {
  console.warn('⚠️  DB_PASSWORD non défini ou encore à la valeur par défaut !');
}

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-do-not-use-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'madinda',
    password: process.env.DB_PASSWORD || 'dev-password-change-me',
    database: process.env.DB_NAME || 'madinda_budget',
    ssl: process.env.DB_SSL === 'true',
  },
} as const;
