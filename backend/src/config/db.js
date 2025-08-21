import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentnest';
  await mongoose.connect(mongoUri, {
    autoIndex: true
  });
  console.log('MongoDB connected');
};

export default connectDB;


