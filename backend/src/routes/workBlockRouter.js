import express from 'express';
import { getWorkBlocksController, addWorkBlockController } from '../controllers/workBlockController.js';

const workBlockRouter = express.Router();
workBlockRouter.get('/', getWorkBlocksController);
workBlockRouter.post('/', addWorkBlockController);

export { workBlockRouter };
