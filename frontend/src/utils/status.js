export const getDisplayStatus = (property, currentUser, options = {}) => {
  const perspective = options.perspective === 'owner' ? 'owner' : 'renter';

  const hasEnded = (booking) => {
    if (!booking || !booking.endDate) return false;
    return new Date(booking.endDate) < new Date();
  };

  // Prefer backend-provided status/currentBooking when available
  const isAvailable = !!property?.isAvailable;
  const currentBooking = property?.currentBooking || property?.activeBooking || null;
  const bookedBy = property?.bookedBy;

  if (perspective === 'owner') {
    if (isAvailable) return { label: 'Available', cls: 'bg-green-100 text-green-800' };
    if (hasEnded(currentBooking)) return { label: 'Awaiting Reset', cls: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Booked', cls: 'bg-red-100 text-red-800' };
  }

  // renter perspective
  if (isAvailable) return { label: 'Available', cls: 'bg-green-100 text-green-800' };
  if (currentUser && bookedBy && String(bookedBy) === String(currentUser.id)) {
    return { label: 'Booked', cls: 'bg-red-100 text-red-800' };
  }
  return { label: 'Unavailable', cls: 'bg-yellow-100 text-yellow-800' };
};
