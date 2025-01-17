import express from 'express';
import { getWorkBlocksController, addWorkBlockController, deleteWorkBlockController } from '../controllers/workBlockController.js';

const workBlockRouter = express.Router();
workBlockRouter.get('/', getWorkBlocksController);
workBlockRouter.post('/', addWorkBlockController);
workBlockRouter.delete('/:workBlockId', deleteWorkBlockController);

export { workBlockRouter };
