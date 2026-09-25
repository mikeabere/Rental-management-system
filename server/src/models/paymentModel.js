import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const paymentSchema = new Schema({ 
    lease:{type:Schema.Types.ObjectId,ref:'Lease',required:true,index:true}, 
    tenant:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true}, 
    amount:{type:Number,min:1,required:true}, 
    phone:{type:String,required:true}, 
    method:{type:String,enum:['MPESA'],default:'MPESA'}, 
    status:{type:String,enum:['PENDING','COMPLETED','FAILED','CANCELLED'],default:'PENDING',index:true}, 
    merchantRequestId:String, 
    checkoutRequestId:{type:String,index:true,sparse:true,unique:true}, 
    mpesaReceiptNumber:String, 
    resultCode:Number, 
    resultDescription:String, 
    callbackPayload:Schema.Types.Mixed, 
    paidAt:Date },
    {timestamps:true}
);
export const Payment=model('Payment',paymentSchema);