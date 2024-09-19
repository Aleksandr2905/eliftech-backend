import { ctrlWrapper } from "../decorators/index.js";
import HttpError from "../helpers/HttpError.js";
import Events from "../models/Events.js";

const getAllEvents = async (req, res) => {
  const { title, event_date, organizer, page = 1, limit = 8 } = req.query;
  const skip = (page - 1) * limit;
  let filter = {};

  if (title) {
    filter.title = { $regex: new RegExp(title, "i") };
  }
  if (event_date) {
    filter.event_date = event_date;
  }
  if (organizer) {
    filter.organizer = { $regex: new RegExp(organizer, "i") };
  }

  const totalEvents = await Events.countDocuments(filter);
  const totalPages = Math.ceil(totalEvents / limit);

  const result = await Events.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  if (result.length === 0) {
    throw HttpError(404, "Not found");
  }

  res.json({
    currentPage: Number(page),
    totalPages: totalPages,
    totalEvents: totalEvents,
    events: result,
  });
};

const getEventById = async (req, res) => {
  const { id } = req.params;

  const result = await Events.findById(id);
  if (!result) {
    throw HttpError(404, "Not Found");
  }

  res.json(result);
};

const addUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, birthDate, source } = req.body;

  const event = await Events.findById(id);
  if (!event) {
    throw HttpError(404, "Event not found");
  }

  const existingUser = event.user.find((user) => user.email === email);
  if (existingUser) {
    throw HttpError(
      400,
      "User with this email is already registered for the event"
    );
  }

  const newUser = {
    fullName,
    email,
    birthDate,
    source,
  };

  event.user.push(newUser);
  await event.save();

  res.status(201).json(event);
};

export default {
  getAllEvents: ctrlWrapper(getAllEvents),
  getEventById: ctrlWrapper(getEventById),
  addUser: ctrlWrapper(addUser),
};
