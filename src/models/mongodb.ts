import mongoose from 'mongoose';
import config from '../config';

export const db = mongoose.connect(
  `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
  { useNewUrlParser: true },
);
