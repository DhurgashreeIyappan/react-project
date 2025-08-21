import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true, index: true },
  type: { type: String, required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  size: { type: Number },
  furnished: { type: Boolean, default: false },
  petFriendly: { type: Boolean, default: false },
  amenities: [{ type: String }],
  availabilityDate: { type: Date },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);


