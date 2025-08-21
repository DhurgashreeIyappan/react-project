import Property from '../models/Property.js';
import { validationResult } from 'express-validator';

export const createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const data = { ...req.body, owner: req.user.id };
  const property = await Property.create(data);
  res.status(201).json({ property });
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findOneAndUpdate({ _id: id, owner: req.user.id }, req.body, { new: true });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json({ property });
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findOneAndDelete({ _id: id, owner: req.user.id });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json({ success: true });
};

export const myProperties = async (req, res) => {
  const items = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json({ properties: items });
};

export const getProperty = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findById(id);
  if (!property) return res.status(404).json({ message: 'Not found' });
  res.json({ property });
};

export const listProperties = async (req, res) => {
  const {
    q,
    location,
    priceMin,
    priceMax,
    propertyType,
    bedroomsMin,
    bathroomsMin,
    furnished,
    petFriendly,
    page = 1,
    limit = 12
  } = req.query;

  const filter = {};
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } }
    ];
  }
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (priceMin) filter.price = { ...(filter.price || {}), $gte: Number(priceMin) };
  if (priceMax) filter.price = { ...(filter.price || {}), $lte: Number(priceMax) };
  if (propertyType) filter.type = propertyType;
  if (bedroomsMin) filter.bedrooms = { $gte: Number(bedroomsMin) };
  if (bathroomsMin) filter.bathrooms = { $gte: Number(bathroomsMin) };
  if (furnished === 'true') filter.furnished = true;
  if (furnished === 'false') filter.furnished = false;
  if (petFriendly === 'true') filter.petFriendly = true;
  if (petFriendly === 'false') filter.petFriendly = false;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Property.countDocuments(filter)
  ]);
  res.json({ properties: items, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
};


