import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; 
import morgan from 'morgan'; 
import rateLimit from 'express-rate-limit';
import { errorHandler, notFound } from './middleware.js'; 
import {authRoutes} from './routes/authRoutes.js';
import {propertyRoutes} from './routes/propertyRoutes.js';
import {unitRoutes} from './routes/unitRoutes.js';
import {leaseRoutes} from './routes/leaseRoutes.js';
import {paymentRoutes} from './routes/paymentRoutes.js';

const app=express(); 

app.use(helmet()); 
app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173'})); 
app.use(express.json({limit:'1mb'}));
app.use(morgan('combined')); 
app.use(rateLimit({windowMs:15*60*1000,max:300,standardHeaders:true,legacyHeaders:false}));

const parse=(schema,data)=>{
    const result=schema.safeParse(data);
     if(!result.success){
        const e=new Error(result.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')); 
        e.statusCode=400; 
        throw e;
    } 
    return result.data;
};

app.get('/api/health',(req,res)=>
    res.json({status:'ok',service:'Rental-management-system-api'})
);

app.use('/api/auth',authRoutes);
app.use('/api/properties',propertyRoutes);
app.use('/api/units',unitRoutes);
app.use('/api/leases',leaseRoutes);
app.use('/api/payments',paymentRoutes);


app.use(notFound);
app.use(errorHandler); 
export default app;