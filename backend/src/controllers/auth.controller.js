import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password, phone, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password, phone, role });
  const token = signToken(user);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user });
};

export const updateProfile = async (req, res) => {
  const { name, phone, bio, profilePicture } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, bio, profilePicture },
    { new: true }
  );
  res.json({ user });
};


