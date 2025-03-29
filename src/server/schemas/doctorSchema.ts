
import { z } from 'zod';

export const doctorProfileSchema = z.object({
  specialization: z.string(),
  experience: z.number(),
  qualifications: z.array(z.string()),
  bio: z.string(),
  consultationFee: z.number(),
  availability: z.array(
    z.object({
      day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
      startTime: z.string(),
      endTime: z.string(),
    })
  ),
});

export const doctorUpdateSchema = z.object({
  specialization: z.string().optional(),
  experience: z.number().optional(),
  qualifications: z.array(z.string()).optional(),
  bio: z.string().optional(),
  consultationFee: z.number().optional(),
  availability: z
    .array(
      z.object({
        day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
});

export const doctorReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string(),
});

export type DoctorProfile = z.infer<typeof doctorProfileSchema>;
export type DoctorUpdate = z.infer<typeof doctorUpdateSchema>;
export type DoctorReview = z.infer<typeof doctorReviewSchema>;
