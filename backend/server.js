import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import renterRoutes from './src/routes/renter.routes.js';
import propertyRoutes from './src/routes/property.routes.js';
import bookingRoutes from './src/routes/booking.routes.js';
import contentRoutes from './src/routes/content.routes.js';
import contactRoutes from './src/routes/contact.routes.js';
import { notFoundHandler, errorHandler } from './src/middleware/error.js';

dotenv.config(); // Loads .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ------------------------------------------------------
   🟢 FIXED CORS CONFIGURATION
------------------------------------------------------ */
const allowedOrigins = [
  "http://localhost:3000",
  "https://property-rental-marketplace-qlkg.vercel.app",
  "https://property-rental-marketplace-qwpj.vercel.app",
  "https://property-rental-marketplace-suof.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow Postman / mobile apps
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log("❌ BLOCKED ORIGIN BY CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* ------------------------------------------------------
   Other Middleware
------------------------------------------------------ */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

/* ------------------------------------------------------
   Static File Handling
------------------------------------------------------ */
app.use('/api/images', express.static(path.join(__dirname, 'uploads')));

/* ------------------------------------------------------
   Health Check
------------------------------------------------------ */
app.get('/api/health', (req, res) => res.json({ ok: true }));

/* ------------------------------------------------------
   Routes
------------------------------------------------------ */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/renter', renterRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);

/* ------------------------------------------------------
   Error Handlers
------------------------------------------------------ */
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

/* ------------------------------------------------------
   DB + Server Start
------------------------------------------------------ */
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
