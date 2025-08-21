import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import PropertyCard from '../properties/PropertyCard';
import { FaPlus, FaHome, FaUser, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RenterDashboard = () => {
  const { user } = useAuth();
  const { properties, loading, getUserProperties } = useProperty();
  const [userProperties, setUserProperties] = useState([]);

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (user) {
        try {
          const userProps = await getUserProperties();
          setUserProperties(userProps || []);
        } catch (error) {
          console.error('Error fetching user properties:', error);
          setUserProperties([]);
        }
      }
    };
    fetchUserProperties();
  }, [user, getUserProperties]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Manage your rental properties and track your listings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <FaHome className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{userProperties.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userProperties.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FaUser className="text-white text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userProperties.reduce((sum, p) => sum + (p.views || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/add-property"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <FaPlus className="mr-2" />
                Add New Property
              </Link>
              <Link
                to="/my-properties"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <FaHome className="mr-2" />
                View All Properties
              </Link>
            </div>
          </motion.div>

          {/* Properties Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
              <Link
                to="/my-properties"
                className="text-primary hover:text-primary-dark font-medium"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : userProperties.length === 0 ? (
              <div className="text-center py-12">
                <FaHome className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first rental property</p>
                <Link
                  to="/add-property"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <FaPlus className="mr-2" />
                  Add Your First Property
                </Link>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {userProperties.slice(0, 6).map((property) => (
                  <motion.div
                    key={property._id}
                    variants={itemVariants}
                    className="group"
                  >
                    <PropertyCard property={property} showLink={true} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RenterDashboard;
