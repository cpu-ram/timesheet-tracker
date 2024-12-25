import express from "express";
import { getEmployeesHandler } from '../controllers/employeeController.js';

const employeeRouter = express.Router();
employeeRouter.get("/", getEmployeesHandler);

export { employeeRouter };