import { validationResult } from 'express-validator';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const data = { ...req.body, owner: req.user.id };
    if (data.propertyType && !data.type) {
      data.type = data.propertyType;
    }
    if (data.type && !data.propertyType) {
      data.propertyType = data.type;
    }

    // Convert data types for proper MongoDB storage
    if (data.price) data.price = Number(data.price);
    if (data.bedrooms) data.bedrooms = Number(data.bedrooms);
    if (data.bathrooms) data.bathrooms = Number(data.bathrooms);
    if (data.size) data.size = Number(data.size);

    // Convert furnished string to boolean
    if (data.furnished !== undefined) {
      if (typeof data.furnished === 'string') {
        data.furnished = data.furnished === 'furnished';
      } else {
        data.furnished = Boolean(data.furnished);
      }
    }

    // Convert petFriendly to boolean
    if (data.petFriendly !== undefined) {
      data.petFriendly = Boolean(data.petFriendly);
    }

    // Handle uploaded images - save to uploads folder
    if (req.files && req.files.length > 0) {
      console.log('Processing images...');

      const imagePromises = req.files.map(async (file) => {
        const filename = `${Date.now()}-${file.originalname}`;
        const filepath = path.join(uploadsDir, filename);

        // Write file to uploads folder
        fs.writeFileSync(filepath, file.buffer);

        return {
          filename: filename,
          contentType: file.mimetype,
          uploadDate: new Date()
        };
      });

      data.images = await Promise.all(imagePromises);
      console.log('Images processed:', data.images);
    } else {
      console.log('No images uploaded');
      data.images = [];
    }

    console.log('Final data to save:', data);
    const property = await Property.create(data);
    console.log('Property created successfully:', property._id);
    res.status(201).json({ property });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      message: 'Error creating property',
      error: error.message
    });
  }
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;

  try {
    // Handle field name mapping between frontend and backend
    const updateData = { ...req.body };
    if (updateData.propertyType && !updateData.type) {
      updateData.type = updateData.propertyType;
    }
    // Ensure propertyType is also set for frontend compatibility
    if (updateData.type && !updateData.propertyType) {
      updateData.propertyType = updateData.type;
    }

    // Convert data types for proper MongoDB storage
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.bedrooms) updateData.bedrooms = Number(updateData.bedrooms);
    if (updateData.bathrooms) updateData.bathrooms = Number(updateData.bathrooms);
    if (updateData.size) updateData.size = Number(updateData.size);

    // Convert furnished string to boolean
    if (updateData.furnished !== undefined) {
      if (typeof updateData.furnished === 'string') {
        updateData.furnished = updateData.furnished === 'furnished';
      } else {
        updateData.furnished = Boolean(updateData.furnished);
      }
    }

    // Convert petFriendly to boolean
    if (updateData.petFriendly !== undefined) {
      updateData.petFriendly = Boolean(updateData.petFriendly);
    }

    // Handle uploaded images - save to uploads folder
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(async (file) => {
        const filename = `${Date.now()}-${file.originalname}`;
        const filepath = path.join(uploadsDir, filename);
        
        // Write file to uploads folder
        fs.writeFileSync(filepath, file.buffer);
        
        return {
          filename: filename,
          contentType: file.mimetype,
          uploadDate: new Date()
        };
      });

      updateData.images = await Promise.all(imagePromises);
    }

    const property = await Property.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      updateData,
      { new: true }
    );

    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ property });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property' });
  }
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findOneAndDelete({ _id: id, owner: req.user.id });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json({ success: true });
};

export const myProperties = async (req, res) => {
  try {
    const items = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 });

    // Ensure propertyType field is populated for frontend compatibility
    const properties = items.map(item => {
      const property = item.toObject();
      if (property.type && !property.propertyType) {
        property.propertyType = property.type;
      }
      return property;
    });

    res.json({ properties });
  } catch (error) {
    console.error('Error fetching my properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
};

export const getProperty = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findById(id).populate('owner', 'name email');
  if (!property) return res.status(404).json({ message: 'Not found' });

  // Ensure propertyType field is populated for frontend compatibility
  const propertyData = property.toObject();
  if (propertyData.type && !propertyData.propertyType) {
    propertyData.propertyType = propertyData.type;
  }

  // Attach minimal active booking info if present for status calculation
  if (propertyData.activeBooking) {
    const active = await Booking.findById(propertyData.activeBooking).select('startDate endDate status user');
    if (active) {
      propertyData.activeBooking = {
        _id: active._id,
        startDate: active.startDate,
        endDate: active.endDate,
        status: active.status,
        user: active.user
      };
      propertyData.currentBooking = propertyData.activeBooking;
    }
  }

  // Compute a simple status string for convenience on the frontend
  propertyData.status = propertyData.isAvailable ? 'available' : 'booked';
  if (!propertyData.isAvailable && propertyData.currentBooking && propertyData.currentBooking.endDate && new Date(propertyData.currentBooking.endDate) < new Date()) {
    propertyData.status = 'awaiting_reset';
  }

  res.json({ property: propertyData });
};

export const listProperties = async (req, res) => {
  try {
    const {
      q,
      location,
      priceMin,
      priceMax,
      propertyType,
      type,
      bedroomsMin,
      bathroomsMin,
      furnished,
      petFriendly,
      featured,
      includeUnavailable,
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};
    if (!includeUnavailable || includeUnavailable === 'false') {
      filter.isAvailable = true;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ];
    }
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (priceMin) filter.price = { ...(filter.price || {}), $gte: Number(priceMin) };
    if (priceMax) filter.price = { ...(filter.price || {}), $lte: Number(priceMax) };
    if (propertyType || type) filter.type = propertyType || type;
    if (bedroomsMin) filter.bedrooms = { $gte: Number(bedroomsMin) };
    if (bathroomsMin) filter.bathrooms = { $gte: Number(bathroomsMin) };
    if (furnished === 'true') filter.furnished = true;
    if (furnished === 'false') filter.furnished = false;
    if (petFriendly === 'true') filter.petFriendly = true;
    if (petFriendly === 'false') filter.petFriendly = false;

    const skip = (Number(page) - 1) * Number(limit);
    if (featured === 'true') {
      filter.featured = true;
    }

    const [items, total] = await Promise.all([
      Property.find(filter).populate('owner', 'name bookedBy').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Property.countDocuments(filter)
    ]);

    // Ensure propertyType field is populated for frontend compatibility
    const properties = await Promise.all(items.map(async (item) => {
      const property = item.toObject();
      if (property.type && !property.propertyType) {
        property.propertyType = property.type;
      }
      if (property.activeBooking) {
        const active = await Booking.findById(property.activeBooking).select('startDate endDate status user');
        if (active) {
          property.activeBooking = {
            _id: active._id,
            startDate: active.startDate,
            endDate: active.endDate,
            status: active.status,
            user: active.user
          };
          property.currentBooking = property.activeBooking;
        }
      }
      property.status = property.isAvailable ? 'available' : 'booked';
      if (!property.isAvailable && property.currentBooking && property.currentBooking.endDate && new Date(property.currentBooking.endDate) < new Date()) {
        property.status = 'awaiting_reset';
      }
      return property;
    }));

    res.json({ properties, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    console.error('Error listing properties:', error);
    res.status(500).json({ message: 'Error listing properties' });
  }
};

// Get all properties for owners (including unavailable ones)
export const getAllPropertiesForOwner = async (req, res) => {
  try {
    const items = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 });

    // Ensure propertyType field is populated for frontend compatibility
    const properties = await Promise.all(items.map(async (item) => {
      const property = item.toObject();
      if (property.type && !property.propertyType) {
        property.propertyType = property.type;
      }
      if (property.activeBooking) {
        const active = await Booking.findById(property.activeBooking).select('startDate endDate status user');
        if (active) {
          property.activeBooking = {
            _id: active._id,
            startDate: active.startDate,
            endDate: active.endDate,
            status: active.status,
            user: active.user
          };
          property.currentBooking = property.activeBooking;
        }
      }
      property.status = property.isAvailable ? 'available' : 'booked';
      if (!property.isAvailable && property.currentBooking && property.currentBooking.endDate && new Date(property.currentBooking.endDate) < new Date()) {
        property.status = 'awaiting_reset';
      }
      return property;
    }));

    res.json({ properties });
  } catch (error) {
    console.error('Error fetching all properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
};

// Allow property owner to reset availability after booking end date
export const resetAvailability = async (req, res) => {
  try {
    const { id } = req.params; // property id
    const property = await Property.findOne({ _id: id, owner: req.user.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (!property.activeBooking) {
      property.isAvailable = true;
      property.bookedBy = null;
      property.activeBooking = null;
      await property.save();
      return res.json({ property });
    }

    const booking = await Booking.findById(property.activeBooking);
    if (!booking) {
      property.isAvailable = true;
      property.bookedBy = null;
      property.activeBooking = null;
      await property.save();
      return res.json({ property });
    }

    const now = new Date();
    if (booking.endDate > now) {
      return res.status(400).json({ message: 'Booking has not ended yet' });
    }

    if (!['completed', 'cancelled', 'rejected'].includes(booking.status)) {
      booking.status = 'completed';
      await booking.save();
    }

    property.isAvailable = true;
    property.bookedBy = null;
    property.activeBooking = null;
    await property.save();

    res.json({ property });
  } catch (error) {
    console.error('Error resetting availability:', error);
    res.status(500).json({ message: 'Error resetting availability' });
  }
};


