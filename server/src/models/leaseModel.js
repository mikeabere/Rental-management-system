import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const leaseSchema = new Schema({ 
    unit:{type:Schema.Types.ObjectId,ref:'Unit',required:true,index:true}, 
    tenant:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true}, 
    startDate:{type:Date,required:true}, 
    endDate:Date, 
    monthlyRent:{type:Number,min:0,required:true}, 
    deposit:{type:Number,min:0,default:0}, 
    status:{type:String,enum:['ACTIVE','ENDED','PENDING'],default:'ACTIVE'} },
    {timestamps:true}
);

export const Lease=model('Lease',leaseSchema); 