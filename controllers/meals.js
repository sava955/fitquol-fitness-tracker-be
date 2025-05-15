import Meal from "../models/meal.js";

import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

export const getMeals = (req, res, next) => {
  const start = parseInt(req.query.start);
  const limit = parseInt(req.query.limit);

  const name = req.query.name || "";

  let query = {};

  if (name) {
    query = {
      name: { $regex: name, $options: "i" },
    };
  }

  Meal.find(query)
  .skip(start > 1 ? (start - 1) * limit : 0)
  .limit(limit)
    .then((data) => {
      if (data.length === 0) {
        next(CreateSuccess(200, name !== '' ? "No meals found" : "No more meals to load!", []));
      } else {
        next(CreateSuccess(200, "Meals fetched successfully!", data));
      }
    })
    .catch(() => {
      next(CreateError(500, "Fetching meals failed!"));
    });
};

export const getMealById = (req, res, next) => {
  Meal.findById(req.params.id).then((data) => {
    next(CreateSuccess(200, "Meal fetched successfully!", data));
  }).catch(() => {
    next(CreateError(500, "Fetching meal failed!"));
  });
};

