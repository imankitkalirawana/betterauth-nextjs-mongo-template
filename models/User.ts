import { Base } from '@/lib/interface';
import mongoose, { Model } from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
  blocked = 'blocked',
  deleted = 'deleted',
  unverified = 'unverified'
}

export enum UserRole {
  admin = 'admin',
  doctor = 'doctor',
  nurse = 'nurse',
  receptionist = 'receptionist',
  pharmacist = 'pharmacist',
  laboratorist = 'laboratorist',
  user = 'user'
}

export interface UserType extends Base {
  email: string;
  phone: string;
  password: string;
  name?: string;
  role: UserRole;
  status: UserStatus;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  zipcode?: string;
  passwordResetToken?: string;
  dob?: {
    day: string;
    month: string;
    year: string;
  };
  gender?: 'male' | 'female' | 'other';
  image?: string;
}

export interface AuthUser {
  user?: {
    name: string;
    email: string;
    role: UserRole;
    id: string;
  };
  expires?: string;
}

// @ts-ignore
const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email is invalid'
      ]
    },
    phone: String,
    password: {
      type: String,
      default: 'secure_password123'
    },
    name: {
      type: String
    },
    dob: {
      day: {
        type: String,
        default: '01'
      },
      month: {
        type: String,
        default: '01'
      },
      year: {
        type: String,
        default: '2000'
      }
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male'
    },
    role: {
      type: String,
      enum: UserRole,
      default: 'user'
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'unverified'
    },
    country: {
      type: String,
      default: 'IN'
    },
    state: {
      type: String,
      default: 'MH'
    },
    city: String,
    address: String,
    zipcode: String,
    passwordResetToken: String,
    updatedBy: String,
    createdBy: String
  },
  {
    timestamps: true,
    collection: 'user'
  }
);

const User: Model<UserType> =
  mongoose.models.User || mongoose.model<UserType>('User', userSchema);
export default User;
