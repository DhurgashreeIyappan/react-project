import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSearch, FaCalendar, FaBookmark, FaEye } from 'react-icons/fa';
import PropertyCard from '../properties/PropertyCard';
import { motion } from 'framer-motion';
import client, { getImageUrl } from '../../api/client';
import { getDisplayStatus } from '../../utils/status';
import toast from 'react-hot-toast';

const RenterDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBookings: 0, activeBookings: 0, pastBookings: 0 });
  const [nextBooking, setNextBooking] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [nextProperty, setNextProperty] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, dashRes] = await Promise.all([
        client.get('/bookings/me'),
        client.get('/renter/dashboard')
      ]);
      setBookings(bookingsRes.data.bookings || []);
      setStats({
        totalBookings: dashRes.data.totalBookings || 0,
        activeBookings: dashRes.data.activeBookings || 0,
        pastBookings: dashRes.data.pastBookings || 0
      });
      const nb = dashRes.data.nextBooking || null;
      setNextBooking(nb);
      if (nb?.property?._id) {
        try {
          const propRes = await client.get(`/properties/${nb.property._id}`);
          setNextProperty(propRes.data.property);
        } catch (e) {
          console.error('Error fetching next property details:', e);
          setNextProperty(null);
        }
      } else {
        setNextProperty(null);
      }
      setRecentActivity(dashRes.data.recentActivity || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };


  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRenterPropertyStatus = (property) => {
    if (property.isAvailable) return { label: 'Available', unavailable: false };
    // If this renter booked it
    if (property.bookedBy && user && String(property.bookedBy) === String(user.id)) {
      return { label: 'Booked', unavailable: false };
    }
    // Another renter booked it: check if after end date and not reset yet
    if (property.activeBooking && property.activeBooking.endDate) {
      const ended = new Date(property.activeBooking.endDate) < new Date();
      if (ended) return { label: 'Unavailable', unavailable: true };
    }
    // Otherwise it's currently booked in-progress
    return { label: 'Unavailable', unavailable: true };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">
              Welcome back, {user?.name}! Here’s a quick look at your rental activity.
          </h1>
            <p className="text-sm text-gray-600">Stay on top of your trips with live stats and quick actions.</p>
        </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/properties"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow"
          >
            <FaSearch className="mr-2" />
              Browse Properties
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl shadow-sm p-6 flex items-center gap-5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">🏷️</div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl shadow-sm p-6 flex items-center gap-5">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shadow-inner">🟢</div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl shadow-sm p-6 flex items-center gap-5">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">📅</div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Past Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pastBookings}</p>
            </div>
          </div>
          </div>
          
        {/* Split grid: Upcoming (left) and Recent Activity (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Booking Summary (Left) */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Booking</h3>
            {!nextBooking ? (
              <p className="text-gray-600 text-sm">No upcoming bookings.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 items-start">
                {/* Full property card styled like in Bookings page */}
                {nextProperty ? (
                  <div className="border border-gray-200 rounded-lg bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-28 h-20 bg-gray-100 overflow-hidden rounded">
                        <img
                          src={nextProperty.images?.[0]?.filename ? getImageUrl(nextProperty.images[0].filename) : '/placeholder-property.svg'}
                          alt={nextProperty.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/placeholder-property.svg'; }}
                        />
                    </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">{nextProperty.title}</h4>
                        <p className="text-gray-600 text-xs sm:text-sm mb-1 line-clamp-1">{nextProperty.location}</p>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <FaCalendar className="mr-2" />
                          <span>{new Date(nextBooking.startDate).toLocaleDateString()} – {new Date(nextBooking.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm sm:text-base font-bold text-primary-500">₹{nextProperty.price?.toLocaleString()}</div>
                        <Link
                          to={`/properties/${nextProperty._id}`}
                          className="mt-2 inline-block text-primary-500 hover:text-primary-600 text-xs sm:text-sm font-medium"
                        >
                          View →
                        </Link>
                      </div>
                      </div>
                    </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-100 p-4 text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">{nextBooking.property?.title}</p>
                    <p>{nextBooking.property?.location}</p>
                    <p>
                      {new Date(nextBooking.startDate).toLocaleDateString()} – {new Date(nextBooking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {/* Link removed as requested to reduce clutter */}
            </div>
          )}
        </div>

          {/* Recent Activity (Right) */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow p-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p className="text-gray-600 text-sm">No recent activity.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentActivity.slice(0,3).map((act) => (
                  <li key={act.id} className="py-3 text-sm text-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs capitalize whitespace-nowrap">{act.status}</span>
                      <span className="truncate">{act.property?.title || 'Property'}</span>
          </div>
                    <span className="text-gray-500 text-xs whitespace-nowrap">{new Date(act.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
                        )}
                      </div>
                  </div>


        {/* Removed My Bookings list from dashboard to reduce clutter */}

        {/* My Bookings section removed on dashboard as requested */}

        {/* Browse properties moved to dedicated page (/properties) */}
      </div>
    </div>
  );
};

export default RenterDashboard;
