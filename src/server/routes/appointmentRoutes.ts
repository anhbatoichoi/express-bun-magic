
import express from 'express';
import {
  getUserAppointments,
  getDoctorAppointments,
  createAppointment,
  updateAppointmentStatus,
  updateMedicalInfo,
  deleteAppointment,
} from '../controllers/appointmentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected with authMiddleware in the main server file

// User appointment routes
router.get('/user', getUserAppointments);
router.get('/doctor', getDoctorAppointments);
router.post('/', createAppointment);
router.put('/:id/status', updateAppointmentStatus);
router.put('/:id/medical', updateMedicalInfo);
router.delete('/:id', deleteAppointment);

export const appointmentRoutes = router;
