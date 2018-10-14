import express, { NextFunction, Request, Response } from 'express';
import expressWs from 'express-ws';
import morgan from 'morgan';

import apiRoutes from './api/routes';
import * as checkin from './api/ws/checkin';

const wsInstance = expressWs(express());
const app = wsInstance.app;

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

checkin.registerWs(wsInstance);

app.use('/api', apiRoutes);

app.use(express.static('static_web'));

app.use('/env', (req, res) => {
  res.json(process.env);
});

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
