import express from 'express';
import { getWorkBlocksController, addWorkBlockController, deleteWorkBlockController, updateWorkBlockController } from '../controllers/workBlockController.js';

const workBlockRouter = express.Router();
workBlockRouter.get('/', getWorkBlocksController);
workBlockRouter.post('/', addWorkBlockController);
workBlockRouter.delete('/:workBlockId', deleteWorkBlockController);
workBlockRouter.put('/:workBlockId', updateWorkBlockController);

export { workBlockRouter };
