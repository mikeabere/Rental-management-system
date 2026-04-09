import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  lease: { type: mongoose.Schema.Types.ObjectId, ref: 'Lease', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['mpesa', 'jenga', 'bank'], required: true },
  transactionId: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  phone: String,
  date: { type: Date, default: Date.now }
});
export default mongoose.model('Payment', paymentSchema);