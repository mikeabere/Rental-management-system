 
// import dotenv from "dotenv";
// dotenv.config();
// import axios from 'axios';
// import crypto from 'crypto';
// import fs from 'fs';

// // Load private key for signature
// //console.log("Key Path:", process.env.JENGA_PRIVATE_KEY_PATH);
// const privateKey = fs.readFileSync(process.env.JENGA_PRIVATE_KEY_PATH, 'utf8');

// export const getJengaToken = async () => {
//   // Jenga uses different auth - check developer.jengahq.io for latest
//   const response = await axios.post(`${process.env.JENGA_BASE_URL}/v3-apis/token`, {
//     apiKey: process.env.JENGA_API_KEY,
//     clientId: process.env.JENGA_CLIENT_ID
//   });
//   return response.data.token;
// };

// const createSignature = (dataString) => {
//   const sign = crypto.createSign('RSA-SHA256');
//   sign.update(dataString);
//   return sign.sign(privateKey, 'base64');
// };

// // Example: Initiate Equitel STK Push (similar to M-Pesa)
// export const initiateJengaSTK = async (phone, amount, reference) => {
//   const token = await getJengaToken();
//   const timestamp = new Date().toISOString();
  
//   const payload = {
//     merchant: { accountNumber: "YOUR_EQUITY_MERCHANT_ACCOUNT" },
//     payment: {
//       ref: reference,
//       amount: amount,
//       currency: "KES",
//       mobileNumber: phone,
//       telco: "EQUITEL"
//     }
//   };

//   // Signature formula from Jenga docs
//   const signatureString = `${payload.merchant.accountNumber}${payload.payment.ref}${payload.payment.mobileNumber}${payload.payment.telco}${payload.payment.amount}${payload.payment.currency}`;
//   const signature = createSignature(signatureString);

//   const response = await axios.post(
//     `${process.env.JENGA_BASE_URL}/v3-apis/transaction-api/v3.0/remittance/equitel-stk-ussd-push`,
//     payload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Signature: signature,
//         'Content-Type': 'application/json'
//       }
//     }
//   );
//   return response.data;
// };

