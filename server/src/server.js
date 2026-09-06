import app from './app.js';
 import { connectDb } from './db.js'; 
 import { env } from './config.js';
connectDb()
.then(()=>app.listen(env.PORT,()=>console.log(`API listening on ${env.PORT}`)))
.catch(error=>{console.error('Startup failed',error);
    process.exit(1);});