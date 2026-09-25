import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const unitSchema = new Schema({ 
    property:{type:Schema.Types.ObjectId,ref:'Property',required:true,index:true}, 
    unitNumber:{type:String,required:true,trim:true}, 
    bedrooms:{type:Number,min:0,default:1}, 
    monthlyRent:{type:Number,min:0,required:true}, 
    status:{type:String,enum:['VACANT','OCCUPIED','MAINTENANCE'],default:'VACANT'} },{timestamps:true});
    unitSchema.index({property:1,unitNumber:1},
    {unique:true}
);

export const Unit=model('Unit',unitSchema); 