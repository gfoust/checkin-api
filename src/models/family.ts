import mongoose from 'mongoose';
import './mongodb';
import toJSON from './toJSON';

export interface FamilyData {
  tag: string;
  name: string;
}

const FamilySchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 20,
    match: /^[\w\-$.]+$/,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
}, { toJSON });

export interface Family extends FamilyData, mongoose.Document { }

export const Family = mongoose.model<Family>('Family', FamilySchema);

export default Family;
