import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, enum: ['house', 'apartment', 'shop', 'office'], required: true },
  rentAmount: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied'], default: 'available' },
  description: String
});
export default  mongoose.model('Property', propertySchema);