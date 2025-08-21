import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  const { property, startDate, endDate, message } = req.body;
  const booking = await Booking.create({ user: req.user.id, property, startDate, endDate, message });
  res.status(201).json({ booking });
};

export const myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('property').sort({ createdAt: -1 });
  res.json({ bookings });
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
  if (!booking) return res.status(404).json({ message: 'Not found' });
  res.json({ booking });
};


