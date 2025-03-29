
import { z } from 'zod';

export const appointmentCreateSchema = z.object({
  doctor: z.string(),
  date: z.string().transform(val => new Date(val)),
  startTime: z.string(),
  endTime: z.string(),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
});

export const appointmentStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
});

export const appointmentMedicalSchema = z.object({
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
});

export type AppointmentCreate = z.infer<typeof appointmentCreateSchema>;
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type AppointmentMedical = z.infer<typeof appointmentMedicalSchema>;
