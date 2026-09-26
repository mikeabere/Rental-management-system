import { Unit, Lease } from './models.js'; 
import { asyncHandler, auth } from './middleware.js'; 
import { z } from 'zod';
app.get('/api/leases',auth(),asyncHandler(async(req,res)=>{
    const query=req.user.role==='tenant'?{tenant:req.user._id}:{ }; 
res.json({leases:await Lease.find(query).populate('unit tenant').sort('-createdAt')});
}));

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
res.status(201).json({lease});
}));