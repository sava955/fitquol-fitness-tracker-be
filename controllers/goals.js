const Goal = require("../models/goal");

const { setDate } = require("../utils/set-date");

const { CreateSuccess } = require("../utils/success");
const { CreateError } = require("../utils/error");

exports.getCurrentGoal = async (req, res, next) => {
  try {
    const date = setDate(new Date());
    const goal = await Goal.findOne({
      user: req.user.id,
      fromDate: { $lte: date },
    }).sort({ fromDate: -1 });

    next(CreateSuccess(200, "Goal fetched successfully!", goal));
  } catch {
    next(CreateError(500, "Fetching goal failed!"));
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id })
      .skip(start > 1 ? (start - 1) * limit : 0)
      .limit(limit);

    next(CreateSuccess(200, "User goals successfully!", goals));
  } catch {
    next(CreateError(500, "Fetching goals failed!"));
  }
};
