import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], default: 'pending' },
  message: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);


