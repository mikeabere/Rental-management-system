import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1), 
  JWT_SECRET: z.string().min(32), 
  JWT_EXPIRES_IN: z.string().default('1d'), 
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  MPESA_ENV: z.enum(['sandbox','production']).default('sandbox'), 
  MPESA_CONSUMER_KEY: z.string().default(''), 
  MPESA_CONSUMER_SECRET: z.string().default(''),
  MPESA_SHORTCODE: z.string().default(''), 
  MPESA_PASSKEY: z.string().default(''), 
  MPESA_CALLBACK_URL: z.string().url().default('https://example.invalid/callback'), 
  MPESA_TRANSACTION_TYPE: z.string().default('CustomerPayBillOnline')
});

export const env = schema.parse(process.env);
