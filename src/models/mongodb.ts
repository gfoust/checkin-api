import mongoose from 'mongoose';
import config from '../config';

export const db = mongoose.connect(
  `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
  { useNewUrlParser: true },
);

export function isObjectId(x: unknown): x is mongoose.Types.ObjectId {
  return x instanceof mongoose.Types.ObjectId;
}
