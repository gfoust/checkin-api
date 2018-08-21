import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import * as classes from './classes';
import * as families from './families';
import * as students from './students';

const router = express.Router();

router.use(bodyParser.json());
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400);
  res.json({ message: err.message });
});

router.param('familyid', families.addFamilyToLocals);
router.get('/families/', families.readFamilies);
router.get('/families/:familyid', families.readFamily);
router.post('/families/', families.createFamily);
router.patch('/families/:familyid', families.patchFamily);
router.delete('/families/:familyid', families.deleteFamily);

router.param('classid', classes.addClassToLocals);
router.get('/classes/', classes.readClasses);
router.get('/classes/:classid', classes.readClass);
router.post('/classes/', classes.createClass);
router.patch('/classes/:classid', classes.patchClass);
router.delete('/classes/:classid', classes.deleteClass);

router.param('studentid', students.addStudentToLocals);
router.get('/students/', students.readStudents);
router.get('/students/:studentid', students.readStudent);
router.post('/students/', students.createStudent);
router.patch('/students/:studentid', students.patchStudent);
router.delete('/students/:studentid', students.deleteStudent);

export default router;
