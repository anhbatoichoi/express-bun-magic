
import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
  addDoctorReview,
  getDoctorAvailability,
} from '../controllers/doctorController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);

// Protected routes
router.post('/', authMiddleware, createDoctorProfile);
router.put('/', authMiddleware, updateDoctorProfile);
router.post('/:id/reviews', authMiddleware, addDoctorReview);

export const doctorRoutes = router;
