import { User, Property, Unit, Lease, Payment } from './controllers/models.js'; 
import { asyncHandler, auth, signToken } from './middleware.js'; 
import { z } from 'zod';

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
        const paid=await Payment.aggregate([{$match:req.user.role==='tenant'?{tenant:req.user._id,status:'COMPLETED'}:{status:'COMPLETED'}},
            {$group:{_id:null,total:{$sum:'$amount'}}}]); 
        res.json({properties,
            units:units.length,
            occupiedUnits:units.filter(u=>u.status==='OCCUPIED').length,
            activeLeases:leases,
            collected:paid[0]?.total||0});
        }));