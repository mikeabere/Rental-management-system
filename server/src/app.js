import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; 
import morgan from 'morgan'; 
import rateLimit from 'express-rate-limit'; 
import bcrypt from 'bcryptjs'; 
import { z } from 'zod';
import { User, Property, Unit, Lease, Payment } from './models.js'; 
import { asyncHandler, auth, errorHandler, notFound, signToken } from './middleware.js'; 
import { initiateStkPush, normalizePhone } from './daraja.js';

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
        e.statusCode=400; throw e;
    } 
    return result.data;
};

app.get('/api/health',(req,res)=>
    res.json({status:'ok',service:'rental-property-management-api'})
);

app.post('/api/auth/register',asyncHandler(async(req,res)=>{
    const body=parse(z.object({name:z.string().min(2),
        email:z.string().email(),
        phone:z.string().optional(),
        password:z.string().min(8),
        role:z.enum(['manager','tenant']).default('tenant')}),
        req.body);
 if(await User.exists({email:body.email.toLowerCase()})) 
    return res.status(409).json({message:'Email already registered'}); 
 const user=await User.create({...body,email:body.email.toLowerCase(),
    passwordHash:await bcrypt.hash(body.password,12)});
  res.status(201).json({token:signToken(user),
    user:{id:user._id,
        name:user.name,
        email:user.email,
        role:user.role}});
    }));

app.post('/api/auth/login',asyncHandler(async(req,res)=>{
    const body=parse(z.object({email:z.string().email(),
        password:z.string()}),req.body);
 const user=await User.findOne({email:body.email.toLowerCase()}).select('+passwordHash'); 
 if(!user||!(await bcrypt.compare(body.password,user.passwordHash))) 
    return res.status(401).json({message:'Invalid credentials'}); 
 res.json({token:signToken(user),
    user:{id:user._id,
        name:user.name,
        email:user.email,
        role:user.role}});
    }));

app.get('/api/auth/me',auth(),(req,res)=>
    res.json({user:{id:req.user._id,
        name:req.user.name,
        email:req.user.email,
        phone:req.user.phone,
        role:req.user.role
    }}));

app.get('/api/dashboard/summary',auth(),asyncHandler(async(req,res)=>{
    const propertyFilter=['admin','manager'].includes(req.user.role)?{owner:req.user._id}:{}; 
const properties=await Property.countDocuments(propertyFilter); 
const units=await Unit.find(propertyFilter.property?{property:{$in:await Property.find(propertyFilter).distinct('_id')}}:{});
 const leases=await Lease.countDocuments(req.user.role==='tenant'?{tenant:req.user._id,status:'ACTIVE'}:{status:'ACTIVE'}); 
 const paid=await Payment.aggregate([{$match:req.user.role==='tenant'?{tenant:req.user._id,status:'COMPLETED'}:{status:'COMPLETED'}},{$group:{_id:null,total:{$sum:'$amount'}}}]); 
 res.json({properties,units:units.length,occupiedUnits:units.filter(u=>u.status==='OCCUPIED').length,activeLeases:leases,collected:paid[0]?.total||0});}));
app.get('/api/properties',auth(['admin','manager']),asyncHandler(async(req,res)=>
    res.json({properties:await Property.find({owner:req.user._id}).sort('-createdAt')})));
app.post('/api/properties',auth(['admin','manager']),asyncHandler(async(req,res)=>{
    const body=parse(z.object({name:z.string().min(2),address:z.string().min(3),description:z.string().max(2000).optional()}),
req.body); 
res.status(201).json({property:await Property.create({...body,owner:req.user._id})});
}));

app.get('/api/properties/:id/units',auth(['admin','manager']),asyncHandler(async(req,res)=>{
    const property=await Property.findOne({_id:req.params.id,owner:req.user._id});
 if(!property)return res.status(404).json({message:'Property not found'}); res.json({units:await Unit.find({property:property._id}).sort('unitNumber')});}));
app.post('/api/properties/:id/units',auth(['admin','manager']),asyncHandler(async(req,res)=>{
    const property=await Property.findOne({_id:req.params.id,owner:req.user._id});
 if(!property)return res.status(404).json({message:'Property not found'}); 
 const body=parse(z.object({unitNumber:z.string().min(1),bedrooms:z.number().int().min(0).default(1),monthlyRent:z.number().positive()}),req.body);
  res.status(201).json({unit:await Unit.create({...body,property:property._id})});}));
app.get('/api/leases',auth(),asyncHandler(async(req,res)=>{const query=req.user.role==='tenant'?{tenant:req.user._id}:{ }; 
res.json({leases:await Lease.find(query).populate('unit tenant').sort('-createdAt')});}));
app.post('/api/leases',auth(['admin','manager']),asyncHandler(async(req,res)=>{
    const body=parse(z.object({unit:z.string(),
        tenant:z.string(),
        startDate:z.coerce.date(),
        endDate:z.coerce.date().optional(),
        monthlyRent:z.number().positive(),
        deposit:z.number().min(0).default(0)}),
req.body); 
const lease=await Lease.create(body); 
await Unit.findByIdAndUpdate(body.unit,{status:'OCCUPIED'}); 
res.status(201).json({lease});}));
app.get('/api/payments',auth(),asyncHandler(async(req,res)=>{
    const query=req.user.role==='tenant'?{tenant:req.user._id}:{};
     res.json({payments:await Payment.find(query).populate('lease').sort('-createdAt').limit(100)});}));
app.post('/api/payments/mpesa/stk-push',auth(),asyncHandler(async(req,res)=>{
    const body=parse(z.object({lease:z.string(),
        amount:z.number().positive(),
        phone:z.string().min(9)}),
    req.body);
 const lease=await Lease.findOne(req.user.role==='tenant'?{_id:body.lease,tenant:req.user._id}:{_id:body.lease}); 
 if(!lease)
    return res.status(404).json({message:'Lease not found'}); 
const payment=await Payment.create({lease:lease._id,
    tenant:lease.tenant,
    amount:body.amount,phone:normalizePhone(body.phone)});
     try {
        const result=await initiateStkPush({phone:body.phone,
            amount:body.amount,
            accountReference:`LEASE-${lease._id.toString().slice(-8)}`,
            transactionDesc:'Rental payment'});
             payment.merchantRequestId=result.MerchantRequestID; 
             payment.checkoutRequestId=result.CheckoutRequestID;
              await payment.save(); 
              res.status(202).json({message:'STK Push sent. Complete it on your phone.',
                paymentId:payment._id,
                checkoutRequestId:payment.checkoutRequestId});} 
              catch(error){
                payment.status='FAILED';
                 payment.resultDescription=error.message; 
                 await payment.save(); 
                 throw error;
                }}));
app.post('/api/payments/mpesa/callback',asyncHandler(async(req,res)=>{
    const callback=req.body?.Body?.stkCallback; 
    if(!callback)
        return res.status(400).json({message:'Invalid callback payload'});
     const payment=await Payment.findOne({checkoutRequestId:callback.CheckoutRequestID}); 
     if(payment){
        payment.resultCode=callback.ResultCode;
         payment.resultDescription=callback.ResultDesc; 
        payment.callbackPayload=callback; 
        if(callback.ResultCode===0){
            const items=Object.fromEntries((callback.CallbackMetadata?.Item||[]).map(item=>[item.Name,item.Value])); 
            payment.status='COMPLETED'; 
            payment.mpesaReceiptNumber=items.MpesaReceiptNumber; 
            payment.paidAt=new Date();}else payment.status='FAILED';
             await payment.save();} res.json({ResultCode:0,ResultDesc:'Accepted'});
            }));
app.use(notFound); app.use(errorHandler); 
export default app;