import mongoose from 'mongoose';
import './mongodb';
import toJSON from './toJSON';

export interface ClassData {
  tag: string;
  name: string;
  color: string;
}

const ClassSchema = new mongoose.Schema({
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
  color: {
    type: String,
    required: true,
    trim: true,
    match: /^[\w\-\:\.\#]+$/,
  },
}, { toJSON });

export interface Class extends ClassData, mongoose.Document { }

export const Class = mongoose.model<Class>('Class', ClassSchema);

export function isClass(x: unknown): x is Class {
  return x instanceof Class;
}

export default Class;
