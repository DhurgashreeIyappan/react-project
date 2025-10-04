import express from 'express';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const router = express.Router();

// Get image by filename
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Create GridFS bucket
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'property-images'
    });

    // Find the file
    const files = await bucket.find({ filename }).toArray();
    
    if (files.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const file = files[0];
    
    // Set appropriate headers
    res.set({
      'Content-Type': file.metadata?.contentType || 'image/jpeg',
      'Content-Length': file.length,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });

    // Stream the file
    const downloadStream = bucket.openDownloadStream(file._id);
    downloadStream.pipe(res);

  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ message: 'Error serving image' });
  }
});

export default router;
