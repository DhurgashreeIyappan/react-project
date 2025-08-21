import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-4">About RentNest</h1>
          <p className="text-text-secondary max-w-3xl mx-auto">
            We connect renters with quality, verified properties and make renting simple, transparent, and stress-free.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-surface rounded-2xl shadow-lg border border-border p-8"
          >
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Who We Are</h2>
            <p className="text-text-secondary leading-relaxed">
              RentNest is a modern rental platform built for both property owners and renters. Our mission is to make property discovery, booking,
              and management effortless with intuitive tools and a trusted marketplace.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface rounded-2xl shadow-lg border border-border p-8"
          >
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Our Mission</h2>
            <p className="text-text-secondary leading-relaxed">
              To simplify renting by providing verified listings, smart search, and clear communication—so you can find the right home, faster.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-surface rounded-2xl shadow-lg border border-border p-8"
        >
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Why Choose RentNest</h2>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Verified listings with clear pricing and details</li>
            <li>Smart location and budget filters to narrow choices</li>
            <li>Seamless booking requests and status tracking</li>
            <li>Responsive support and an easy-to-use interface</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default About;


