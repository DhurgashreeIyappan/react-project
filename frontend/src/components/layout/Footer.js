import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebook />, href: 'https://facebook.com/RentNest' },
    { name: 'Twitter', icon: <FaTwitter />, href: 'https://twitter.com/RentNest' },
    { name: 'Instagram', icon: <FaInstagram />, href: 'https://instagram.com/RentNest' },
    { name: 'LinkedIn', icon: <FaLinkedin />, href: 'https://linkedin.com/company/rentnest' },
  ];

  return (
    <footer className="bg-surface border-t border-border">
      {/* Curved divider */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-surface h-16"></div>
      </div>
      
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-glow">
                  <FaHome className="text-white text-2xl" />
                </div>
                <span className="text-3xl font-bold text-gradient">
                  RentNest
                </span>
              </Link>
              <p className="text-text-secondary text-lg leading-relaxed max-w-lg">
                Find your perfect rental property with ease. We connect property owners with reliable tenants for a seamless rental experience.
              </p>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-1"
          >
                         <h3 className="text-xl font-semibold mb-6 text-primary-500">Quick Links</h3>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-text-secondary hover:text-primary-500 transition-colors duration-200 flex items-center space-x-3 group"
                  >
                                         <div className="w-2 h-2 bg-primary-500 rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1"
          >
                         <h3 className="text-xl font-semibold mb-6 text-primary-500">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-text-secondary">
                                 <FaMapMarkerAlt className="text-primary-500 mt-1 flex-shrink-0" />
                <span>123 Rental Street, City, State 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-text-secondary">
                                 <FaPhone className="text-primary-500 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-text-secondary">
                                 <FaEnvelope className="text-primary-500 flex-shrink-0" />
                <span>info@rentnest.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Links & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-border mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white hover:shadow-glow transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-text-muted text-center md:text-right">
              <p>&copy; {currentYear} RentNest. All rights reserved.</p>
              <p className="text-sm mt-2 flex items-center justify-center md:justify-end space-x-1">
                <span>Made with</span>
                <FaHeart className="text-error animate-pulse" />
                <span>for better rental experiences</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
