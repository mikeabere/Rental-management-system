import { asyncHandler, auth } from './middleware.js'; 
import { Lease, Payment } from './models.js'; 
import { initiateStkPush, normalizePhone } from './daraja.js';
import { z } from 'zod';

app.get('/api/payments',auth(),asyncHandler(async(req,res)=>{
    const query=req.user.role==='tenant'?{tenant:req.user._id}:{};
     res.json({payments:await Payment.find(query).populate('lease').sort('-createdAt').limit(100)});
    }));

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
        const result=await initiateStkPush({
            phone:body.phone,
            amount:body.amount,
            accountReference:`LEASE-${lease._id.toString().slice(-8)}`,
            transactionDesc:'Rental payment'
        });
             payment.merchantRequestId=result.MerchantRequestID; 
             payment.checkoutRequestId=result.CheckoutRequestID;
              await payment.save(); 
              res.status(202).json({message:'STK Push sent. Complete it on your phone.',
                paymentId:payment._id,
                checkoutRequestId:payment.checkoutRequestId});
            } 
              catch(error){
                payment.status='FAILED';
                 payment.resultDescription=error.message; 
                 await payment.save(); 
                 throw error;
                }
            }));

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
            payment.paidAt=new Date();
        }
        else payment.status='FAILED';
             await payment.save();
            } 
            res.json({ResultCode:0,ResultDesc:'Accepted'});
            }));