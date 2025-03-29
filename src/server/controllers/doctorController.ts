
import { Request, Response } from 'express';
import { Doctor } from '../models/Doctor';
import { User } from '../models/User';
import { z } from 'zod';

// Get All Doctors
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find({}).populate('user', 'name email');
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Doctor By ID
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a Doctor Profile
export const createDoctorProfile = async (req: Request, res: Response) => {
  try {
    const doctorSchema = z.object({
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

    const validatedData = doctorSchema.parse(req.body);

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ user: req.user._id });

    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor profile already exists for this user' });
    }

    // Create doctor profile
    const doctor = await Doctor.create({
      user: req.user._id,
      ...validatedData,
    });

    // Update user role to doctor
    await User.findByIdAndUpdate(req.user._id, { role: 'doctor' });

    res.status(201).json(doctor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Update Doctor Profile
export const updateDoctorProfile = async (req: Request, res: Response) => {
  try {
    const doctorSchema = z.object({
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

    const validatedData = doctorSchema.parse(req.body);

    // Find doctor by user ID
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Update doctor
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $set: validatedData },
      { new: true }
    );

    res.json(updatedDoctor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Add Review to Doctor
export const addDoctorReview = async (req: Request, res: Response) => {
  try {
    const reviewSchema = z.object({
      rating: z.number().min(1).max(5),
      comment: z.string(),
    });

    const { rating, comment } = reviewSchema.parse(req.body);
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = doctor.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Doctor already reviewed' });
    }

    // Add review
    const review = {
      user: req.user._id,
      rating,
      comment,
      date: new Date(),
    };

    doctor.reviews.push(review);

    // Calculate average rating
    doctor.averageRating =
      doctor.reviews.reduce((acc, item) => item.rating + acc, 0) / doctor.reviews.length;

    await doctor.save();

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Get Doctor Availability
export const getDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId).select('availability');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor.availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
