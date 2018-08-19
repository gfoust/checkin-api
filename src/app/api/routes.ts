import express from 'express';
import bodyParser from 'body-parser';
import * as families from './families';

const router = express.Router();

router.use(bodyParser.json());

router.param('famtag', families.lookupFamily);
router.get('/families/', families.readFamilies);
router.get('/families/:famtag', families.readFamily);
router.post('/families/', families.createFamily);
router.patch('/families/:famtag', families.patchFamily);
router.delete('/families/:famtag', families.deleteFamily);

export default router;
