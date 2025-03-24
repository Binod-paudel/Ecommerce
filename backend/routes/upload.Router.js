import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
import apiError from '../utils/apiError.js';

dotenv.config();

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to handle stream upload to Cloudinary
const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { folder: 'uploads' }, // Optional: specify a folder
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(error);
                }
                resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

// API Route for Image Upload
router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        // Validate that a file is present
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'No file uploaded or invalid file format' });
        }

        // Log file details for debugging
        console.log('Uploading file:', req.file.originalname, req.file.mimetype);

        // Upload the file to Cloudinary
        const result = await streamUpload(req.file.buffer);

        // Send response with Cloudinary URL
        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Upload Route Error:', error);
        next(new apiError(500, 'Failed to upload image'));
    }
});

export default router;
