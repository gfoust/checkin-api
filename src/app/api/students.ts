import { NextFunction, Request, Response } from 'express';
import { Student } from '../../models/student';
import { Dictionary } from '../../util';
import { lookupClass } from './classes';
import validationError from './validationError';
import { reportDeletedStudent, reportNewStudent, reportUpdatedStudent } from './ws/checkin';

export async function readStudents(req: Request, res: Response) {
  const query: Dictionary<string | null> =  { };
  if (req.query.firstName) {
    query.firstName = req.query.firstName;
  }
  if (req.query.lastName) {
    query.lastName = req.query.lastName;
  }
  if ('class' in req.query) {
    if (req.query) {
      const clas = await lookupClass(req.query.class);
      if (clas) {
        query.class = clas.id;
      }
      else {
        res.json([ ]);
        return;
      }
    }
    else {
      query.class = null;
    }
  }
  const students = await Student.find(query).populate('class');
  res.json(students);
}

export async function createStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      status: req.body.status,
      class: null,
    });

    if (req.body.class) {
      const clas = await lookupClass(req.body.class);
      if (clas) {
        student.class = clas;
      }
      else {
        student.invalidate('class', 'Unknown class', req.body.class, 'Class identifier');
      }
    }

    await student.save();
    res.json(student);
    reportNewStudent(student);
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
    return Student.findById(id).populate('class');
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
  res.json(student);
}

export async function patchStudent(req: Request, res: Response, next: NextFunction) {
  const student = res.locals.student as Student;
  for (const key of [ 'firstName', 'lastName', 'status' ] as Array<keyof Student>) {
    if (key in req.body) {
      student[key] = req.body[key];
    }
  }
  if ('class' in req.body) {
    if (req.body.class) {
      const clas = await lookupClass(req.body.class);
      if (clas) {
        student.class = clas;
      }
      else {
        student.invalidate('class', 'Unknown class', req.body.class, 'Class identifier');
      }
    }
    else {
      student.class = null;
    }
  }

  try {
    await student.save();
    res.json(student);
    reportUpdatedStudent(student);
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
  reportDeletedStudent(student);
}
