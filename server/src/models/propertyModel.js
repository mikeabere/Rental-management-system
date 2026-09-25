import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const propertySchema = new Schema({ 
    owner:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true}, 
    name:{type:String,required:true,trim:true}, 
    address:{type:String,required:true,trim:true}, 
    description:String },
    {timestamps:true}
);


export const Property=model('Property',propertySchema); 