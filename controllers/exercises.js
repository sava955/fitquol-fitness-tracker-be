import Exercise from "../models/exercise.js";

import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

export const getExercises = (req, res, next) => {
  const start = parseInt(req.query.start);
  const limit = parseInt(req.query.limit);

  const description = req.query.description || "";

  let query = {};

  if (description) {
    query = {
      description: { $regex: description, $options: "i" },
    };
  }

  Exercise.find(query)
    .skip(start * limit)
    .limit(limit * 1)
    .then((data) => {
      if (data.length === 0) {
        next(CreateSuccess(200, description !== ""
          ? "No exercises found"
          : "No more exercises to load!", []));
      } else {
        next(CreateSuccess(200, "Exercises fetched successfully!", data));
      }
    })
    .catch((err) => {
      next(CreateError(500, "Fetching exercises failed!"));
    });
};

export const getExerciseById = (req, res, next) => {
  Exercise.findById(req.params.id).then((data) => {
    next(CreateSuccess(200, "Exercise fetched successfully!", data));
  }).catch(() => {
    next(CreateError(500, "Fetching exercise failed!"));
  })
};
