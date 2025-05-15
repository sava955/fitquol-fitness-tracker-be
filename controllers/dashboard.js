import Goal from "../models/goal.js";
import DiaryMeal from "../models/diary-meal.js";
import DiaryExercise from "../models/diary-exercise.js";

import { setDate } from "../utils/set-date.js";

import { setMacronutrients } from "../utils/macronutrients.js";

import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

export const getDashboard = async (req, res, next) => {
  try {
    const user = req.user.id;

    const startDate = req.query.startDate
      ? setDate(req.query.startDate)
      : setDate(
          (() => {
            const date = new Date();
            date.setDate(date.getDate() - 6);
            return date;
          })()
        );
    const endDate = req.query.endDate
      ? setDate(req.query.endDate)
      : setDate(new Date());

    const goals = await getGoals(user, 5);

    const meals = await getMeals(user, startDate, endDate);

    const exercises = await getExercises(user, startDate, endDate);

    const dailyData = getDateRange(startDate, endDate, meals, exercises);

    const todayMeals = meals.filter(
      (meal) => setDate(new Date(meal.day)) === setDate(new Date())
    );

    const todayExercises = exercises.filter(
      (exercise) => setDate(new Date(exercise.day)) === setDate(new Date())
    );

    const dashboard = {
      todayCalories: {
        caloriesRequired: goals[0].caloriesRequired,
        takenCalories: todayMeals ? calculateTakenCalories(todayMeals) : 0,
        burnedCalories: todayExercises
          ? calculateBurnedCalories(todayExercises)
          : 0,
      },
      todayMacros: getDashboardMacronutrients(
        goals[0].macronutrients,
        todayMeals
      ),
      caloriesStatistic: getCaloriesBalance(dailyData),
      weightStatistic: goals,
      exercisesStatistic: getExercisesBalance(dailyData),
      startDate: setDate(req.user.createdAt)
    };

    next(CreateSuccess(200, "Dashboard fetched successfully!", dashboard));
  } catch {
    next(CreateError(500, "Failed to fetch dasboard!"));
  }
};

export const getCaloriesStatistic = async (req, res, next) => {
  try {
    const user = req.user.id;

    const startDate = req.query.startDate
      ? setDate(req.query.startDate)
      : setDate(
          (() => {
            const date = new Date();
            date.setDate(date.getDate() - 6);
            return date;
          })()
        );
    const endDate = req.query.endDate
      ? setDate(req.query.endDate)
      : setDate(new Date());

    const meals = await getMeals(user, startDate, endDate);

    const exercises = await getExercises(user, startDate, endDate);

    const dailyData = getDateRange(startDate, endDate, meals, exercises);

    const caloriesStatistic = getCaloriesBalance(dailyData);

    next(
      CreateSuccess(
        200,
        "Calories Statistic fetched successfully!",
        caloriesStatistic
      )
    );
  } catch {
    next(CreateError(500, "Failed to fetch calories statistic!"));
  }
};

export const getExercisesStatistic = async (req, res, next) => {
  try {
    const user = req.user.id;

    const startDate = req.query.startDate
      ? setDate(req.query.startDate)
      : setDate(
          (() => {
            const date = new Date();
            date.setDate(date.getDate() - 6);
            return date;
          })()
        );
    const endDate = req.query.endDate
      ? setDate(req.query.endDate)
      : setDate(new Date());

    const exercises = await getExercises(user, startDate, endDate);

    const dailyData = getDateRange(startDate, endDate, [], exercises);

    const exercisesStatistic = getExercisesBalance(dailyData);

    next(
      CreateSuccess(
        200,
        "Exercises Statistic fetched successfully!",
        exercisesStatistic
      )
    );
  } catch {
    next(CreateError(500, "Failed to fetch exercises statistic!"));
  }
};

export const getWeightStatistic = async (req, res, next) => {
  try {
    const user = req.user.id;
    const limit = req.query.limit;

    const goals = await getGoals(user, limit);

    next(CreateSuccess(200, "Weight Statistic fetched successfully!", goals));
  } catch {
    next(CreateError(500, "Failed to fetch weight statistic!"));
  }
};

function getGoals(user, limit) {
  const goals = Goal.find({
    user: user,
  })
    .sort({ fromDate: -1 })
    .limit(limit);

  return goals;
}

function getMeals(user, startDate, endDate) {
  const meals = DiaryMeal.find({
    user: user,
    day: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ day: 1 });

  return meals;
}

function getExercises(user, startDate, endDate) {
  const exercises = DiaryExercise.find({
    user: user,
    day: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ day: 1 });

  return exercises;
}

function getDateRange(startDate, endDate, meals, exercises) {
  const dates = [];
  const current = new Date(setDate(endDate));
  const final = new Date(setDate(startDate));

  while (final <= current) {
    const todayMeals = meals.filter(
      (meal) => setDate(new Date(meal.day)) === setDate(current)
    );

    const todayExercises = exercises.filter(
      (exercise) => setDate(new Date(exercise.day)) === setDate(current)
    );

    dates.push({
      day: new Date(current),
      meals: todayMeals,
      exercises: todayExercises,
    });
    current.setDate(current.getDate() - 1);
  }

  return dates;
}

function getDashboardMacronutrients(macronutrients, meals) {
  const macronutrientsTotals = {};

  meals.forEach((item) => {
    item.nutrients.macronutrients.forEach((nutrient) => {
      if (!macronutrientsTotals[nutrient.key]) {
        macronutrientsTotals[nutrient.key] = 0;
      }
      macronutrientsTotals[nutrient.key] += nutrient.value;
    });
  });

  const m = {
    carbohydrates: macronutrients.carbohydrates,
    fats: macronutrients.fats,
    protein: macronutrients.protein,
  };

  return setMacronutrients(macronutrientsTotals, m);
}

function getCaloriesBalance(dailyData) {
  return dailyData.map((day) => ({
    date: day.day,
    takenCalories: calculateTakenCalories(day.meals),
    burnedCalories: calculateBurnedCalories(day.exercises),
    caloriesBalance:
      calculateTakenCalories(day.meals) -
      calculateBurnedCalories(day.exercises),
  }));
}

function getExercisesBalance(dailyData) {
  return dailyData.map((day) => ({
    date: day.day,
    burnedCalories: calculateBurnedCalories(day.exercises),
    durationSum: calculateExercisesDuration(day.exercises),
  }));
}

function calculateTakenCalories(meals) {
  return meals.reduce((sum, meal) => sum + (meal.nutrients.calories || 0), 0);
}

function calculateBurnedCalories(exercises) {
  return exercises.reduce(
    (sum, exercise) => sum + (exercise.caloriesBurned || 0),
    0
  );
}

function calculateExercisesDuration(exercises) {
  return exercises.reduce(
    (sum, exercise) => sum + (exercise.setDuration || 0),
    0
  );
}
