import { Router } from "express";
import { getEmployeesHandler, updateEmployeeNameHandler, completeSignupHandler } from '../controllers/employeeController.js';
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import { Response } from "express";

const employeeRouter: Router = Router();

employeeRouter.get("/", getEmployeesHandler);
employeeRouter.get("/current/name", (req: AuthenticatedRequest, res: Response) => {
  res.json({ name: req.user ? req.user.name : null });
})
employeeRouter.patch("/current/complete-signup", completeSignupHandler);
employeeRouter.patch("/current", updateEmployeeNameHandler);

export { employeeRouter };
