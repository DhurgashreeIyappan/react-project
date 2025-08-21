import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
          <p className="text-text-secondary max-w-3xl mx-auto">
            Have questions or feedback? Send us a message and we’ll get back to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-surface rounded-2xl shadow-lg border border-border p-8"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="How can we help?"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn-primary">Send Message</button>
              </div>
              {sent && (
                <p className="text-sm text-green-600">Message sent! We will reply shortly. (Demo)</p>
              )}
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface rounded-2xl shadow-lg border border-border p-8"
          >
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Company Info</h2>
            <div className="space-y-2 text-text-secondary">
              <p>RentNest HQ</p>
              <p>123 Rental Street, City, State 12345</p>
              <p>Email: info@rentnest.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


