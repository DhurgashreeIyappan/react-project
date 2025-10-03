import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

export const getRenterDashboard = async (req, res) => {
  try {
    const renterId = req.user.id;
    const now = new Date();

    const bookings = await Booking.find({ user: renterId })
      .populate('property', 'title location startDate endDate images')
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => new Date(b.startDate) <= now && new Date(b.endDate) >= now).length;
    const pastBookings = bookings.filter(b => new Date(b.endDate) < now).length;

    const upcoming = bookings
      .filter(b => new Date(b.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;

    // Recent activity: derive from bookings (created/cancelled/accepted)
    const recentActivity = bookings
      .slice(0, 5)
      .map(b => ({
        id: b._id,
        type: b.status === 'cancelled' ? 'booking_cancelled' : 'booking_updated',
        status: b.status,
        property: b.property ? { _id: b.property._id, title: b.property.title, location: b.property.location } : null,
        createdAt: b.createdAt
      }));

    res.json({
      totalBookings,
      activeBookings,
      pastBookings,
      nextBooking: upcoming ? {
        _id: upcoming._id,
        property: upcoming.property ? { _id: upcoming.property._id, title: upcoming.property.title, location: upcoming.property.location } : null,
        startDate: upcoming.startDate,
        endDate: upcoming.endDate
      } : null,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching renter dashboard:', error);
    res.status(500).json({ message: 'Error fetching renter dashboard' });
  }
};



