import mongoose from 'mongoose';
import { Class, isClass } from './class';
import { isObjectId } from './mongodb';

export interface StudentData {
  firstName: string;
  lastName: string;
  class: null | string | mongoose.Types.ObjectId | Class;
  status: string;
}

const StudentSchema = new mongoose.Schema({
  // tag: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   minLength: 3,
  //   maxLength: 20,
  //   match: /^[\w\-$.]+$/,
  //   unique: true,
  // },
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
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: [ 'absent', 'present', 'ready' ],
    default: 'absent',
  },
}, {
  toJSON: {
    getters: false,
    virtuals: false,
    transform: (doc: Student, obj: Student, options: unknown) => {
      obj.id = obj._id;
      delete obj._id;
      delete obj.__v;
      if (isClass(doc.class)) {
        obj.class = doc.class.tag;
      }
      return obj;
    },
  },
});

export interface Student extends StudentData, mongoose.Document { }

export const Student = mongoose.model<Student>('Student', StudentSchema);

export function isStudent(x: unknown): x is Student {
  return x instanceof Student;
}

export default Student;
