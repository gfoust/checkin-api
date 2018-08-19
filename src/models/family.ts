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
    index: true,
  },
  tag: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    match: /^[\w\-$.]+$/,
    unique: true,
  },
}, { toJSON });

export interface Family extends FamilyData, mongoose.Document { }

export const Family = mongoose.model<Family>('Family', FamilySchema);

export default Family;
