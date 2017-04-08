import express = require('express');
import * as controller from './thing.controller';

const router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.delete('/:id', controller.destroy);

export default router;
