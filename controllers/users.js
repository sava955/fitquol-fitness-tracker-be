const User = require("../models/user");
const Goal = require("../models/goal");

const bcrypt = require("bcrypt");

const { setDate } = require("../utils/set-date");
const { setUserGoal } = require("../utils/set-user-goal");

const { CreateSuccess } = require("../utils/success");
const { CreateError } = require("../utils/error");

exports.getCurrentUser = (req, res, next) => {
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

exports.updateUser = async (req, res, next) => {
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

      if (hasChanged && !isSameDate) {
        const goalData = await getGoalsRequest(req, user);
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
        const goalData = await getGoalsRequest(req, user);
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

/*exports.updateUser = async (req, res, next) => {
  //try {
    const id = req.params.id;

    let user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      context: 'query'
    }).populate({
      path: "goals",
      options: { sort: { fromDate: -1 } },
    });


    if (req.body.weight && req.body.goal && req.body.height) {
      if (
        user.weight !== req.body.weight ||
        user.goal !== req.body.goal ||
        user.height !== req.body.height
      ) {
        const goal = await Goal.findOne({
          user: user._id,
          fromDate: setDate(new Date(req.body.date)),
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

        const updatedGoalData = await setUserGoal(goalRequest);

        if (goal) {
          await goal.updateOne({
            fromDate: setDate(req.body.date),
            measurementSystem: req.body.measurementSystem,
            caloriesRequired: updatedGoalData.caloriesRequired,
            macronutrients: updatedGoalData.macronutrients,
            micronutrients: updatedGoalData.micronutrients,
            user: user._id,
            ...goalRequest,
          });

          user = await User.findById(req.user.id).populate({
            path: "goals",
            options: { sort: { fromDate: -1 } },
          });
        } else {
          const goalData = {
            fromDate: setDate(req.body.date),
            measurementSystem: req.body.measurementSystem,
            weight: req.body.weight,
            height: req.body.height,
            goal: req.body.goal,
            weightPerWeek: req.body.weightPerWeek,
            activityLevel: req.body.activityLevel,
            caloriesRequired: updatedGoalData.caloriesRequired,
            macronutrients: updatedGoalData.macronutrients,
            micronutrients: updatedGoalData.micronutrients,
            user: user._id,
          };

          const newGoal = new Goal(goalData);
          await newGoal.save();

          user = await User.updateOne(
            { _id: req.user.id },
            { $push: { goals: newGoal } }
          );
        }

        await user.save();
      }
    }

    next(CreateSuccess(200, "User data updated successfully!", user));
  //} catch {
  //  next(CreateError(500, "Faild to update user data!"));
 // }
};*/

/*exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    let user = await User.findByIdAndUpdate(id, req.body, {
      new: true
    }).populate({
      path: "goals",
      options: { sort: { fromDate: -1 } },
    });

    if (!user) {
      return next(CreateError(404, "User not found."));
    }

    const { weight, goal, height, date, weightPerWeek, activityLevel } = req.body;

    const isGoalDataProvided = weight && goal && height;

    if (isGoalDataProvided) {
      const hasChanged = (
        user.weight !== weight ||
        user.goal !== goal ||
        user.height !== height
      );

      if (hasChanged) {
        const goalDate = setDate(new Date(date));
        const existingGoal = await Goal.findOne({ user: user._id, fromDate: { $gte: goalDate } });

        const goalRequest = {
          dateOfBirth: setDate(user.dateOfBirth),
          gender: user.gender,
          weight: Number(weight),
          height: Number(height),
          goal,
          weightPerWeek: Number(weightPerWeek),
          activityLevel,
        };

        const updatedGoalData = await setUserGoal(goalRequest);

        const goalData = {
          fromDate: goalDate,
          measurementSystem: req.body.measurementSystem,
          caloriesRequired: updatedGoalData.caloriesRequired,
          macronutrients: updatedGoalData.macronutrients,
          micronutrients: updatedGoalData.micronutrients,
          user: user._id,
          ...goalRequest,
        };

        if (existingGoal) {
          await existingGoal.updateOne(goalData);
        } else {
          const newGoal = new Goal(goalData);
          await newGoal.save();

          await User.updateOne(
            { _id: user._id },
            { $push: { goals: newGoal._id } }
          );
        }

        user = await User.findById(user._id).populate({
          path: "goals",
          options: { sort: { fromDate: -1 } },
        });
      }
    }

    return next(CreateSuccess(200, "User data updated successfully!", user));
  } catch (error) {
    return next(CreateError(500, "Failed to update user data!"));
  }
};*/

exports.updatePassword = async (req, res, next) => {
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
