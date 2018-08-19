import mongoose from 'mongoose';
import './mongodb';
import toJSON from './toJSON';

export interface FamilyData {
  name: string;
}

const FamilySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    index: true,
  },
  tag: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    match: /^[\w\-$.]+$/,
    unique: true,
  }
}, { toJSON });

export interface Family extends FamilyData, mongoose.Document { }

export const Family = mongoose.model<Family>('Family', FamilySchema);

export default Family;
