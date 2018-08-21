import mongoose from 'mongoose';

import Family from './family';
import './mongodb';
import toJSON from './toJSON';

export interface StudentData {
  tag: string;
  firstName: string;
  lastName: string;
  family: string | Family;
}

const StudentSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 20,
    match: /^[\w\-$.]+$/,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  family: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Family',
  },
}, {
  toJSON: {
    getters: false,
    virtuals: false,
    transform: (doc: Student, obj: Student, options: unknown) => {
      obj.id = obj._id;
      delete obj._id;
      delete obj.__v;
      if (typeof obj.family === 'object') {
        obj.family = obj.family.tag;
      }
      return obj;
    },
  },
});

export interface Student extends StudentData, mongoose.Document { }

export const Student = mongoose.model<Student>('Student', StudentSchema);

export default Student;
