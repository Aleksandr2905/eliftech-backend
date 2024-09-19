import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, addUpdateSetting } from "./hooks.js";

const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["social", "friends", "myself"],
    },
  },
  { versionKey: false, timestamps: true }
);

const eventsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    event_date: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    user: [userSchema],
  },
  { versionKey: false, timestamps: true }
);

export const userRegisterSchema = Joi.object({
  fullName: Joi.string().required("Full name is required"),
  email: Joi.string().pattern(emailRegexp).required("Email is required"),
  birthDate: Joi.string().required("Birth date is required"),
  source: Joi.string()
    .valid("social", "friends", "myself")
    .required("Source method is required"),
});

eventsSchema.post("save", handleSaveError);

eventsSchema.pre("findOneAndUpdate", addUpdateSetting);

eventsSchema.post("findOneAndUpdate", handleSaveError);

const Events = model("event", eventsSchema);

export default Events;
