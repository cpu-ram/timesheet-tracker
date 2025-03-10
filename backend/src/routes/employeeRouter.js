import express from "express";
import { getEmployeesHandler, updateEmployeeNameHandler, completeSignupHandler } from '../controllers/employeeController.js';

const employeeRouter = express.Router();

employeeRouter.get("/", getEmployeesHandler);
employeeRouter.get("/current/name", (req, res) => {
  res.json({ name: req.user ? req.user.name : null });
})
employeeRouter.patch("/current/complete-signup", completeSignupHandler);
employeeRouter.patch("/current", updateEmployeeNameHandler);

export { employeeRouter };