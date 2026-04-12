import Payment from '../models/paymentModel.js';
import Lease from '../models/leaseModel.js';
import { initiateSTKPush } from '../utils/mpesa.js';
import { initiateJengaSTK } from '../utils/jenga.js';
import { v4 as uuidv4 } from 'uuid'; //will look into this
//will check on this controller later
export const initiatePayment = async (req, res) => {
  const { leaseId, method, phone, amount } = req.body;
  const lease = await Lease.findById(leaseId).populate('tenant');

  if (!lease) return res.status(404).json({ message: 'Lease not found' });

  const transactionId = uuidv4(); //will look into this
  const payment = await Payment.create({
    lease: leaseId,
    amount,
    method,
    phone,
    transactionId,
    status: 'pending'
  });

  try {
    let result;
    if (method === 'mpesa') {
      result = await initiateSTKPush(phone, amount, `RENT-${lease.property}`, 'Rent Payment');
    } else if (method === 'jenga') {
      result = await initiateJengaSTK(phone, amount, `RENT-${lease.property}`);
    }

    res.status(200).json({ message: 'Payment initiated', payment, providerResponse: result });
  } catch (err) {
    payment.status = 'failed';
    await payment.save();
    res.status(500).json({ message: 'Payment initiation failed', error: err.message });
  }
};

// M-Pesa Callback
export const mpesaCallback = async (req, res) => {
  const { Body } = req.body;
  console.log('M-Pesa Callback received:', JSON.stringify(Body, null, 2));

  if (Body.stkCallback.ResultCode === 0) {
    // Update payment as completed
    await Payment.findOneAndUpdate(
      { transactionId: Body.stkCallback.AccountReference }, // or use CheckoutRequestID
      { status: 'completed' }
    );
    // You can also update lease nextDueDate here
  }
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
};