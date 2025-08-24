import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

export const createBooking = async (req, res) => {
  const { property, startDate, endDate, message } = req.body;
  const booking = await Booking.create({ user: req.user.id, property, startDate, endDate, message });
  res.status(201).json({ booking });
};

export const myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('property').sort({ createdAt: -1 });
  res.json({ bookings });
};

export const getAllBookings = async (req, res) => {
  try {
    let bookings;
    
    if (req.user.role === 'renter') {
      // For renters: return only their own bookings
      bookings = await Booking.find({ user: req.user.id })
        .populate('property', 'title location price images owner')
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'owner') {
      // For owners: return bookings for properties they own
      const myProperties = await Property.find({ owner: req.user.id }).select('_id');
      const propertyIds = myProperties.map(p => p._id);
      
      if (propertyIds.length === 0) {
        bookings = [];
      } else {
        bookings = await Booking.find({ property: { $in: propertyIds } })
          .populate('user', 'name email phone')
          .populate('property', 'title location price images owner')
          .sort({ createdAt: -1 });
      }
    } else {
      return res.status(403).json({ message: 'Invalid user role' });
    }
    
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Find the booking and populate property to check ownership
    const booking = await Booking.findById(id).populate('property');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the user owns the property (only owners can update status)
    if (req.user.role !== 'owner' || booking.property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only update bookings for your own properties' });
    }
    
    // Update the booking status
    const updatedBooking = await Booking.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    ).populate('user', 'name email phone').populate('property', 'title location price images owner');
    
    res.json({ booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
};


