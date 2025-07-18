import {Request} from 'express';

interface AuthenticatedRequest extends Request{
    user?: {
        id?: number;
	name?: string;
	nickname?: string;
    };
}

export {AuthenticatedRequest};
	   
