import { Request, Response, NextFunction } from 'express';
import { Dictionary } from '../../util';
import Family from '../../models/family';

function validationError(err: any) {
  if (err.name === 'ValidationError') {
    const errors: Dictionary<string> = { };
    for (const prop in err.errors) {
      errors[prop] = err.errors[prop].message;
    }

    return {
      message: 'Request contained invalid data',
      errors
    };
  }
}

export async function readFamilies(req: Request, res: Response) {
  let families = await Family.find();
  res.json(families);
}

export async function createFamily(req: Request, res: Response, next: NextFunction) {
  try {
    let family = new Family({ name: req.body.name, tag: req.body.tag });
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

export async function lookupFamily(req: Request, res: Response, next: NextFunction, tag: string) {
  try {
    const family = await Family.findOne({ tag });
    if (family) {
      res.locals.family = family;
      next();
    }
    else {
      res.status(404);
      res.json({ message: `Family '${tag}' was not found`});
    }
  }
  catch(err) {
    next(err);
  }
}

export function readFamily(req: Request, res: Response) {
  res.json(res.locals.family);
}

export function patchFamily(req: Request, res: Response, next: NextFunction) {
  const family = res.locals.family as Family;
  for (const key of [ 'tag', 'family' ]) {
    if (key in req.body) {
      res.locals.family[key] = req.body[key];
    }
  }

  try {
    family.save();
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

export function deleteFamily(req: Request, res: Response) {
  const family = res.locals.family as Family;
  res.locals.family.remove();
  res.json(family);
}
