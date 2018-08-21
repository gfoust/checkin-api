import { NextFunction, Request, Response } from 'express';
import Class from '../../models/class';
import validationError from './validationError';

export async function readClasses(req: Request, res: Response) {
  const classes = await Class.find();
  res.json(classes);
}

export async function createClass(req: Request, res: Response, next: NextFunction) {
  try {
    const aclass = new Class({ name: req.body.name, tag: req.body.tag });
    await aclass.save();
    res.json(aclass);
  }
  catch (err) {
    const verr = validationError(err);
    if (verr) {
      res.status(400);
      res.json(verr);
    }
    else {
      next(err);
    }
  }
}

export async function lookupClass(id: string) {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Class.findById(id);
  }
  else {
    return Class.findOne({ tag: id });
  }
}

export async function addClassToLocals(req: Request, res: Response, next: NextFunction, id: string) {
  try {
    const aclass = await lookupClass(id);

    if (aclass) {
      res.locals.aclass = aclass;
      next();
    }
    else {
      res.status(404);
      res.json({ message: `Class '${id}' was not found`});
    }
  }
  catch (err) {
    next(err);
  }
}

export function readClass(req: Request, res: Response) {
  res.json(res.locals.aclass);
}

export async function patchClass(req: Request, res: Response, next: NextFunction) {
  const aclass = res.locals.aclass as Class;
  for (const key of [ 'tag', 'name' ] as Array<keyof Class>) {
    if (key in req.body) {
      aclass[key] = req.body[key];
    }
  }

  try {
    await aclass.save();
    res.json(aclass);
  }
  catch (err) {
    const verr = validationError(err);
    if (verr) {
      res.status(400);
      res.json(verr);
    }
    else {
      next(err);
    }
  }
}

export async function deleteClass(req: Request, res: Response) {
  const aclass = res.locals.aclass as Class;
  await aclass.remove();
  res.json(aclass);
}
