import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import apiRoutes from './api/routes';

const app = express();

app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.use(express.static('static_web'));

app.use('/env', (req, res) => {
  res.json(process.env);
})

app.use((req, res) => {
    res.status(404);
    res.json({ message: 'The requested resource was not found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500);
  res.json({ message: 'Application failure' });
});

export default app;
