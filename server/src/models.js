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

const propertySchema = new Schema({ 
    owner:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true}, 
    name:{type:String,required:true,trim:true}, 
    address:{type:String,required:true,trim:true}, 
    description:String },
    {timestamps:true}
);

const unitSchema = new Schema({ 
    property:{type:Schema.Types.ObjectId,ref:'Property',required:true,index:true}, 
    unitNumber:{type:String,required:true,trim:true}, 
    bedrooms:{type:Number,min:0,default:1}, 
    monthlyRent:{type:Number,min:0,required:true}, 
    status:{type:String,enum:['VACANT','OCCUPIED','MAINTENANCE'],default:'VACANT'} },{timestamps:true});
    unitSchema.index({property:1,unitNumber:1},
    {unique:true}
);

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

export const User=model('User',userSchema); 
export const Property=model('Property',propertySchema); 
export const Unit=model('Unit',unitSchema); 
export const Lease=model('Lease',leaseSchema); 
export const Payment=model('Payment',paymentSchema);