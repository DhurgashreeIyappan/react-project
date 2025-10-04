import ContactMessage from '../models/ContactMessage.js';

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;
  const doc = await ContactMessage.create({ name, email, message });
  res.status(201).json({ success: true, id: doc._id });
};


