import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true, index: true },
  type: { type: String, required: true },
  propertyType: { type: String }, // Added for frontend compatibility
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  size: { type: Number },
  furnished: { type: Boolean, default: false },
  petFriendly: { type: Boolean, default: false },
  amenities: [{ type: String }],
  availabilityDate: { type: Date },
  images: [{ 
    filename: { type: String },
    contentType: { type: String },
    uploadDate: { type: Date, default: Date.now }
  }],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// Add text search index
propertySchema.index({ title: 'text', description: 'text', location: 'text' });

export default mongoose.model('Property', propertySchema);


