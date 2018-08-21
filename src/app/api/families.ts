import { NextFunction, Request, Response } from 'express';
import Family from '../../models/family';
import validationError from './validationError';

export async function readFamilies(req: Request, res: Response) {
  const families = await Family.find();
  res.json(families);
}

export async function createFamily(req: Request, res: Response, next: NextFunction) {
  try {
    const family = new Family({ name: req.body.name, tag: req.body.tag });
    await family.save();
    res.json(family);
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

export async function lookupFamily(id: string) {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Family.findById(id);
  }
  else {
    return Family.findOne({ tag: id });
  }
}

export async function addFamilyToLocals(req: Request, res: Response, next: NextFunction, id: string) {
  try {
    const family = await lookupFamily(id);

    if (family) {
      res.locals.family = family;
      next();
    }
    else {
      res.status(404);
      res.json({ message: `Family '${id}' was not found`});
    }
  }
  catch (err) {
    next(err);
  }
}

export function readFamily(req: Request, res: Response) {
  res.json(res.locals.family);
}

export async function patchFamily(req: Request, res: Response, next: NextFunction) {
  const family = res.locals.family as Family;
  for (const key of [ 'tag', 'name' ] as Array<keyof Family>) {
    if (key in req.body) {
      family[key] = req.body[key];
    }
  }

  try {
    await family.save();
    res.json(family);
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

export async function deleteFamily(req: Request, res: Response) {
  const family = res.locals.family as Family;
  await family.remove();
  res.json(family);
}
