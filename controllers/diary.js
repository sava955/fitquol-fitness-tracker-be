const DiaryMeal = require("../models/diary-meal");
const DiaryExercise = require("../models/diary-exercise");

const Goal = require("../models/goal");

const { CreateSuccess } = require("../utils/success");
const { CreateError } = require("../utils/error");

const { setMacronutrients } = require("../utils/macronutrients");
const { setMicronutrients } = require("../utils/micronutrients");

const { setDate } = require("../utils/set-date");

exports.getDaiaryByDay = async (req, res, next) => {
  try {
    const user = req.user;
    const day = setDate(req.query.day);

    const meals = await getMealTypes(day, user);
    const exercises = await getExercises(day, user);

    const diary = {
      day: day,
      breakfast: meals.breakfast,
      lunch: meals.lunch,
      dinner: meals.dinner,
      snacks: meals.snacks,
      exercises: exercises,
      goal: meals.goal,
      takenCalories: calculateTakenCalories(meals),
      burnedCalories: calculateBurnedCalories(exercises),
      nutrients: meals.nutrients,
      startDate: setDate(user.createdAt),
    };

    next(CreateSuccess(200, "Diary fetched successfully!", diary));
  } catch {
    next(CreateError(500, "Fetching diary failed!"));
  }
};

exports.addMealToDiary = async (req, res, next) => {
  try {
    const diaryMeal = new DiaryMeal({
      ...req.body,
      day: setDate(req.body.day),
      user: req.user.id,
    });

    await diaryMeal.save();

    next(CreateSuccess(200, "Meal added successfully!", diaryMeal));
  } catch {
    next(CreateError(500, "Failed to add meal!"));
  }
};

exports.updateDiaryMeal = async (req, res, next) => {
  try {
    const id = req.params.id;

    const diaryMeal = {
      ...req.body,
      day: setDate(req.body.day),
    };

    await DiaryMeal.findOneAndUpdate(
      { _id: id },
      { $set: diaryMeal },
      { new: true }
    );

    next(CreateSuccess(200, "Meal updated successfully!", diaryMeal));
  } catch {
    next(CreateError(500, "Meal update failed!"));
  }
};

exports.deleteDiaryMeal = async (req, res, next) => {
  const id = req.params.id;

  DiaryMeal.findOneAndDelete({ _id: id })
    .then((data) => {
      next(CreateSuccess(200, "Meal deleted successfully!", data));
    })
    .catch(() => {
      next(CreateError(500, "Meal delete failed!"));
    });
};

exports.addExerciseToDiary = async (req, res, next) => {
  try {
    const diaryExercise = new DiaryExercise({
      ...req.body,
      day: setDate(req.body.day),
      user: req.user.id,
    });

    await diaryExercise.save();

    next(CreateSuccess(200, "Meal added successfully!", diaryExercise));
  } catch {
    next(CreateSuccess(500, "Failed to add exercise!"));
  }
};

exports.updateDiaryExercise = async (req, res, next) => {
  try {
    const id = req.params.id;
    const diaryExercise = req.body;
    diaryExercise.day = setDate(req.body.day);

    await DiaryExercise.findOneAndUpdate(
      { _id: id },
      { $set: diaryExercise },
      { new: true }
    );

    next(CreateSuccess(200, "Exercise updated successfully!", diaryExercise));
  } catch {
    next(CreateSuccess(500, "Failed to update exercise!"));
  }
};

exports.deleteDiaryExercise = async (req, res, next) => {
  const id = req.params.id;

  DiaryExercise.findOneAndDelete({ _id: id })
    .then((data) => {
      next(CreateSuccess(200, "Exercise deleted successfully!", data));
    })
    .catch(() => {
      next(CreateError(500, "Exercise delete failed!"));
    });
};

async function getMealTypes(day, user) {
  const goal = await getGoal(day, user);

  let meals = {
    breakfast: await getMeals(day, "BREAKFAST", user),
    lunch: await getMeals(day, "LUNCH", user),
    dinner: await getMeals(day, "DINNER", user),
    snacks: await getMeals(day, "SNACKS", user),
    goal: goal,
  };

  meals.nutrients = await calculateDailyNutrients(meals, goal);

  return meals;
}

async function getMeals(day, mealType, user) {
  const meals = await DiaryMeal.find({
    day: day,
    mealType: mealType.toUpperCase(),
    user: user.id,
  });

  return meals;
}

async function getExercises(day, user) {
  const exercises = await DiaryExercise.find({
    day: day,
    user: user.id,
  }).populate("exercise");
  return exercises;
}

async function getGoal(day, user) {
  const goal = await Goal.findOne({ fromDate: { $lte: day }, user: user.id });
  return goal;
}

function calculateTakenCalories(diary) {
  const mealCategories = ["breakfast", "lunch", "dinner", "snacks"];

  return mealCategories.reduce((totalCalories, mealType) => {
    const meals = diary[mealType] || [];
    const mealCalories = meals.reduce(
      (sum, meal) => sum + (meal.nutrients.calories || 0),
      0
    );
    return totalCalories + mealCalories;
  }, 0);
}

async function calculateDailyNutrients(diary, goal) {
  const mealCategories = ["breakfast", "lunch", "dinner", "snacks"];

  const macronutrientsTotals = {};
  const micronutrientsTotals = {};

  mealCategories.forEach((category) => {
    diary[category].forEach((item) => {
      item.nutrients.macronutrients.forEach((nutrient) => {
        if (!macronutrientsTotals[nutrient.key]) {
          macronutrientsTotals[nutrient.key] = 0;
        }
        macronutrientsTotals[nutrient.key] += nutrient.value;
      });

      item.nutrients.micronutrients.forEach((nutrient) => {
        if (!micronutrientsTotals[nutrient.key]) {
          micronutrientsTotals[nutrient.key] = 0;
        }
        micronutrientsTotals[nutrient.key] += nutrient.value;
      });
    });
  });

  const nutrients = {
    macronutrients: setMacronutrients(
      macronutrientsTotals,
      goal.macronutrients
    ),
    micronutrients: setMicronutrients(
      micronutrientsTotals,
      goal.micronutrients
    ),
  };

  return nutrients;
}

function calculateBurnedCalories(exercises) {
  return exercises.reduce(
    (sum, exercise) => sum + (exercise.caloriesBurned || 0),
    0
  );
}
