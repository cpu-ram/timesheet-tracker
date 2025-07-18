import { Router } from 'express';
import { getWorkBlocksController, addWorkBlockController, deleteWorkBlockController, updateWorkBlockController } from '../controllers/workBlockController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const workBlockRouter: Router = Router();

workBlockRouter.use(requireAuth);

workBlockRouter.get('/', getWorkBlocksController);
workBlockRouter.post('/', addWorkBlockController);
workBlockRouter.delete('/:workBlockId', deleteWorkBlockController);
workBlockRouter.put('/:workBlockId', updateWorkBlockController);

export { workBlockRouter };
