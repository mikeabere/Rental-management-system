import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({ 
    name:{type:String,required:true,trim:true},
     email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true}, 
     phone:{type:String,trim:true}, 
     passwordHash:{type:String,required:true,select:false}, 
     role:{type:String,enum:['admin','manager','tenant'],default:'tenant'} },
     {timestamps:true}
    );

 export const User=model('User',userSchema);    