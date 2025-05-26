import User from "../models/user.js";
import Goal from "../models/goal.js";

import bcrypt from "bcrypt";

import { setDate } from "../utils/set-date.js";
import { setUserGoal } from "../utils/set-user-goal.js";

import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

export const getCurrentUser = (req, res, next) => {
  User.findById(req.user.id)
    .select("-password")
    .populate("role", "role")
    .populate({
      path: "goals",
      options: { sort: { fromDate: -1 } },
    })
    .then((data) => {
      next(CreateSuccess(200, "User fetched successfully!", data));
    })
    .catch(() => {
      next(CreateError(500, "Fetching user failed!"));
    });
};

export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    let user = await User.findById(id)
      .select("-password")
      .populate({
        path: "goals",
        options: { sort: { fromDate: -1 } },
      });

    const { weight, goal, height, date, weightPerWeek, activityLevel } =
      req.body;

    const isGoalDataProvided =
      weight && goal && height && weightPerWeek && activityLevel;

    if (isGoalDataProvided) {
      const fromDate = new Date(setDate(date));

      const latestGoal = await Goal.findOne({
        user: id,
        fromDate: { $lte: fromDate },
      }).sort({ fromDate: -1 });

      const latestDate = new Date(latestGoal.fromDate);
      const requestDate = new Date(fromDate);

      const isSameDate =
        latestDate.getFullYear() === requestDate.getFullYear() &&
        latestDate.getMonth() === requestDate.getMonth() &&
        latestDate.getDate() === requestDate.getDate();

      const hasChanged =
        latestGoal.weight !== weight ||
        latestGoal.goal !== goal ||
        latestGoal.height !== height ||
        latestGoal.weightPerWeek !== weightPerWeek ||
        latestGoal.activityLevel !== activityLevel;

      let goalData = await getGoalsRequest(req, user);  

      if (hasChanged && !isSameDate) {
        const newGoal = await new Goal(goalData);
        await newGoal.save();

        user = await User.findByIdAndUpdate(
          { _id: id },
          { $push: { goals: newGoal } },
          { new: true }
        )
          .select("-password")
          .populate({
            path: "goals",
            options: { sort: { fromDate: -1 } },
          });
      } else {
        goalData.fromDate = latestGoal.fromDate;
        await latestGoal.updateOne(goalData);

        user = await User.findById(id)
          .select("-password")
          .populate({
            path: "goals",
            options: { sort: { fromDate: -1 } },
          });
      }
    } else {
      const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        email: req.body.email,
        gender: req.body.gender,
      };

      user = await User.findByIdAndUpdate(
        { _id: id },
        { $set: userData },
        { new: true }
      )
        .select("-password")
        .populate({
          path: "goals",
          options: { sort: { fromDate: -1 } },
        });
    }

    next(CreateSuccess(200, "User data updated successfully!", user));
  } catch {
    next(CreateError(500, "Faild to update user data!"));
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("password");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const isPasswordCorrect = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(CreateError(400, "Password is incorrect!"));
    }

    if (req.body.password !== req.body.passwordConfirmation) {
      return next(CreateError(422, "Password is not a same as confirmation"));
    }

    if (user.password === req.body.currentPassword) {
      return next(CreateError(422, "Password matched"));
    }

    await User.findOneAndUpdate({ _id: id }, { password: hashPassword });

    next(CreateSuccess(200, "Password updated successfully!", {}));
  } catch {
    next(CreateError(500, "Password update faild"));
  }
};

async function getGoalsRequest(req, user) {
  const goalRequest = {
    dateOfBirth: setDate(user.dateOfBirth),
    gender: user.gender,
    weight: Number(req.body.weight),
    height: Number(req.body.height),
    goal: req.body.goal,
    weightPerWeek: Number(req.body.weightPerWeek),
    activityLevel: req.body.activityLevel,
  };

  const updatedGoalData = await setUserGoal(goalRequest);

  return {
    fromDate: new Date(setDate(req.body.date)),
    measurementSystem: req.body.measurementSystem,
    weight: req.body.weight,
    height: req.body.height,
    goal: req.body.goal,
    weightPerWeek: req.body.weightPerWeek,
    activityLevel: req.body.activityLevel,
    caloriesRequired: updatedGoalData.caloriesRequired,
    macronutrients: updatedGoalData.macronutrients,
    micronutrients: updatedGoalData.micronutrients,
    user: req.user.id,
  };
}
