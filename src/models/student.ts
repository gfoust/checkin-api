import mongoose from 'mongoose';
import Class from './class';
import Family from './family';
import './mongodb';

export interface StudentData {
  tag: string;
  firstName: string;
  lastName: string;
  family: string | Family;
  class: string | Class;
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
  class: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Class',
  },
}, {
  toJSON: {
    getters: false,
    virtuals: false,
    transform: (doc: Student, obj: Student, options: unknown) => {
      obj.id = obj._id;
      delete obj._id;
      delete obj.__v;
      if (typeof obj.family === 'object' && ! (obj.family instanceof mongoose.Types.ObjectId)) {
        obj.family = obj.family.tag;
      }
      if (typeof obj.class === 'object' && ! (obj.class instanceof mongoose.Types.ObjectId)) {
        obj.class = obj.class.tag;
      }
      return obj;
    },
  },
});

export interface Student extends StudentData, mongoose.Document { }

export const Student = mongoose.model<Student>('Student', StudentSchema);

export default Student;
