import { Property, Unit } from './models.js';
import { asyncHandler, auth } from './middleware.js'; 
import { z } from 'zod';
app.get('/api/properties',auth(['admin','manager']),asyncHandler(async(req,res)=>
    res.json({properties:await Property.find({owner:req.user._id}).sort('-createdAt')})));

app.post('/api/properties',auth(['admin','manager']),asyncHandler(async(req,res)=>{
    const body=parse(z.object({name:z.string().min(2),
        address:z.string().min(3),
        description:z.string().max(2000).optional()}),
        req.body); 
res.status(201).json({property:await Property.create({...body,owner:req.user._id})});
}));

app.get('/api/properties/:id/units',auth(['admin','manager']),asyncHandler(async(req,res)=>{
    const property=await Property.findOne({_id:req.params.id,owner:req.user._id});
 if(!property)return res.status(404).json({message:'Property not found'});
  res.json({units:await Unit.find({property:property._id}).sort('unitNumber')});
}));

app.post('/api/properties/:id/units',auth(['admin','manager']),asyncHandler(async(req,res)=>{
    const property=await Property.findOne({_id:req.params.id,owner:req.user._id});
 if(!property)return res.status(404).json({message:'Property not found'}); 
 const body=parse(z.object({unitNumber:z.string().min(1),
    bedrooms:z.number().int().min(0).default(1),
    monthlyRent:z.number().positive()}),
    req.body);
  res.status(201).json({unit:await Unit.create({...body,property:property._id})});
}));