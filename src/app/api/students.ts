import { NextFunction, Request, Response } from 'express';
import { Class } from '../../models/class';
import { Family } from '../../models/family';
import { Student } from '../../models/student';
import { lookupClass } from './classes';
import { lookupFamily } from './families';
import validationError from './validationError';

export async function readStudents(req: Request, res: Response) {
  const students = await Student.find().populate('family class');
  res.json(students);
}

export async function createStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = new Student({
      tag: req.body.tag,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      family: await lookupFamily(req.body.family),
      class: await lookupClass(req.body.class),
    });

    await student.save();
    res.json(student);
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

export async function lookupStudent(id: string) {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Student.findById(id);
  }
  else {
    return Student.findOne({ tag: id });
  }
}

export async function addStudentToLocals(req: Request, res: Response, next: NextFunction, id: string) {
  try {
    const student = await lookupStudent(id);

    if (student) {
      res.locals.student = student;
      next();
    }
    else {
      res.status(404);
      res.json({ message: `Student '${id}' was not found` });
    }
  }
  catch (err) {
    next(err);
  }
}

export async function readStudent(req: Request, res: Response) {
  const student = res.locals.student as Student;
  await student.populate('family class').execPopulate();
  res.json(student);
}

export async function patchStudent(req: Request, res: Response, next: NextFunction) {
  const student = res.locals.student as Student;
  for (const key of [ 'tag', 'firstName', 'lastName' ] as Array<keyof Student>) {
    if (key in req.body) {
      student[key] = req.body[key];
    }
  }
  if ('family' in req.body) {
    student.family = await lookupFamily(req.body.family) as Family;
  }
  if ('class' in req.body) {
    student.class = await lookupClass(req.body.class) as Class;
  }

  try {
    await student.save();
    res.json(student);
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

export async function deleteStudent(req: Request, res: Response) {
  const student = res.locals.student as Student;
  await student.remove();
  res.json(student);
}
