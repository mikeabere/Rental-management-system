import request from 'supertest'; 
import { describe,it,expect } from 'vitest';
 import app from './app.js';
describe('API',()=>{it('reports health',async()=>{
    const response=await request(app).get('/api/health'); 
    expect(response.status).toBe(200);
     expect(response.body.status).toBe('ok');
    }); 
    it('rejects protected routes without a token',async()=>{
        const response=await request(app).get('/api/payments');
         expect(response.status).toBe(401);});});
