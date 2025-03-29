
import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  user: mongoose.Types.ObjectId;
  specialization: string;
  experience: number;
  qualifications: string[];
  bio: string;
  consultationFee: number;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  reviews: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
  }[];
  averageRating: number;
}

const doctorSchema = new Schema<IDoctor>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    qualifications: [
      {
        type: String,
        required: true,
      },
    ],
    bio: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);
