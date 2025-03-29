
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { z } from 'zod';

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '30d',
  });
};

// Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
      email: z.string().email({ message: 'Invalid email format' }),
      password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
      role: z.enum(['admin', 'user', 'doctor']).optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
      dateOfBirth: z.string().optional().transform(val => val ? new Date(val) : undefined),
      gender: z.enum(['male', 'female', 'other']).optional(),
    });

    const validatedData = userSchema.parse(req.body);

    // Check if user already exists
    const userExists = await User.findOne({ email: validatedData.email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create(validatedData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update User Profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
      dateOfBirth: z.string().optional().transform(val => val ? new Date(val) : undefined),
      gender: z.enum(['male', 'female', 'other']).optional(),
    });

    const validatedData = userSchema.parse(req.body);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (validatedData.name) user.name = validatedData.name;
    if (validatedData.email) user.email = validatedData.email;
    if (validatedData.password) user.password = validatedData.password;
    if (validatedData.phoneNumber) user.phoneNumber = validatedData.phoneNumber;
    if (validatedData.address) user.address = validatedData.address;
    if (validatedData.dateOfBirth) user.dateOfBirth = validatedData.dateOfBirth;
    if (validatedData.gender) user.gender = validatedData.gender;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      dateOfBirth: updatedUser.dateOfBirth,
      gender: updatedUser.gender,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Get All Users (Admin Only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete User (Admin Only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
