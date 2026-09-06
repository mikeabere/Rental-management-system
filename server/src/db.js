import mongoose from 'mongoose';
import { env } from './config.js';
export async function connectDb() { 
    mongoose.set('strictQuery', true); 
    await mongoose.connect(env.MONGODB_URI); 
}
export async function disconnectDb() {
     await mongoose.disconnect(); 
    }