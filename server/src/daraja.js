import { env } from './config.js';
const base=env.MPESA_ENV==='production'?'https://api.safaricom.co.ke':'https://sandbox.safaricom.co.ke';
function authHeader(){ 
    return Buffer.from(`${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`).toString('base64'); 
}
export async function getAccessToken(){
     const response=await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`,
        {headers:{Authorization:`Basic ${authHeader()}`
    }}); 
if(!response.ok) throw new Error(`Daraja OAuth failed (${response.status})`);
 const data=await response.json();
 return data.access_token; 
}
export function normalizePhone(phone){ 
    const digits=String(phone).replace(/\D/g,''); 
    if(digits.startsWith('0')) 
        return `254${digits.slice(1)}`; 
    if(digits.startsWith('7')) return `254${digits}`; 
    if(digits.startsWith('254')) return digits; 
    throw new Error('Use a valid Kenyan mobile number'); 
}
export async function initiateStkPush({phone,amount,accountReference,transactionDesc}){ 
    if(!env.MPESA_CONSUMER_KEY||!env.MPESA_CONSUMER_SECRET||!env.MPESA_PASSKEY)
         throw Object.assign(new Error('Daraja credentials are not configured'),{statusCode:503}); 
        const timestamp=new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,14); 
        const password=Buffer.from(`${env.MPESA_SHORTCODE}${env.MPESA_PASSKEY}${timestamp}`).toString('base64'); 
        const token=await getAccessToken(); 
        const response=await fetch(`${base}/mpesa/stkpush/v1/processrequest`,
            {method:'POST',headers:{Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'},
            body:JSON.stringify({BusinessShortCode:env.MPESA_SHORTCODE,
                Password:password,
                Timestamp:timestamp,
                TransactionType:env.MPESA_TRANSACTION_TYPE,
                Amount:Math.round(amount),
                PartyA:normalizePhone(phone),
                PartyB:env.MPESA_SHORTCODE,
                PhoneNumber:normalizePhone(phone),
                CallBackURL:env.MPESA_CALLBACK_URL,
                AccountReference:accountReference,
                TransactionDesc:transactionDesc})}); 
                const data=await response.json(); 
                if(!response.ok||data.ResponseCode!=='0')
                     throw Object.assign(new Error(data.errorMessage||data.ResponseDescription||'Daraja STK Push failed'),
                    {statusCode:502,details:data});
                     return data; 
                    }