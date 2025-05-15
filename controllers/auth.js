import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import Role from "../models/role.js";
import User from "../models/user.js";
import Goal from "../models/goal.js";

import { setDate } from "../utils/set-date.js";
import { setUserGoal } from "../utils/set-user-goal.js";

import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    const role = await Role.findOne({ role: "User" });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    if (existingUser) {
      return next(CreateError(422, "User with this email already exists"));
    }

    if (req.body.password !== req.body.passwordConfirmation) {
      return next(CreateError(422, "Password is not a same as confirmation"));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: setDate(req.body.dateOfBirth),
      gender: req.body.gender,
      email: req.body.email,
      password: hashPassword,
      profileImage: req.body.profileImage,
      role: role,
      goals: [],
    });

    const goalRequest = {
      dateOfBirth: setDate(user.dateOfBirth),
      gender: user.gender,
      weight: Number(req.body.weight),
      height: Number(req.body.height),
      goal: req.body.goal,
      weightPerWeek: Number(req.body.weightPerWeek),
      activityLevel: req.body.activityLevel,
    };

    const goal = await setUserGoal(goalRequest);

    const newUser = new User(user);
    await newUser.save({ session });

    const goalData = {
      fromDate: setDate(new Date()),
      measurementSystem: req.body.measurementSystem,
      weight: req.body.weight,
      height: req.body.height,
      goal: req.body.goal,
      weightPerWeek: req.body.weightPerWeek,
      activityLevel: req.body.activityLevel,
      caloriesRequired: goal.caloriesRequired,
      macronutrients: goal.macronutrients,
      micronutrients: goal.micronutrients,
      user: newUser._id,
    };

    const newGoal = new Goal(goalData);
    await newGoal.save({ session });

    newUser.goals.push(newGoal._id);
    await newUser.save({ session });

    await session.commitTransaction();
    session.endSession();
    next(CreateSuccess(200, "User Registered Successfully!", {}));
  } catch {
    next(CreateError(500, "User Registration faild!"));
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate("role");

    if (!user) {
      return next(CreateError(404, "User not found!"));
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(CreateError(400, "Password is incorrect!"));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, createdAt: user.createdAt },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    next(CreateSuccess(200, "Login Success!", token));
  } catch {
    return next(CreateError(500, "Something went wrong!"));
  }
};
