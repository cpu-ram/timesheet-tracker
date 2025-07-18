import {Response, NextFunction} from 'express';
import {AuthenticatedRequest} from '../types/AuthenticatedRequest.js';

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction){
    if(!req.user){
	return res.status(401).json({message: 'Unauthorized'});
    }
    next();
}
