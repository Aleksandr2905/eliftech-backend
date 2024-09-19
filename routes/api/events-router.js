import express from "express";
import eventsController from "../../controllers/events-controller.js";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import validateBody from "../../decorators/validateBody.js";
import { userRegisterSchema } from "../../models/Events.js";

const eventsRouter = express.Router();

eventsRouter.get("/", eventsController.getAllEvents);

eventsRouter.get("/:id", eventsController.getEventById);

eventsRouter.post(
  "/:id",
  isEmptyBody,
  validateBody(userRegisterSchema),
  eventsController.addUser
);

export default eventsRouter;
