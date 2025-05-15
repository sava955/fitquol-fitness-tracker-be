const Food = require("../models/food");
const Goal = require("../models/goal");

const { CreateSuccess } = require("../utils/success");
const { CreateError } = require("../utils/error");

const { setCalories } = require("../utils/calories");
const { setMacronutrients } = require("../utils/macronutrients");
const { setMicronutrients } = require("../utils/micronutrients");

exports.getFood = async (req, res, next) => {
  try {
    const start = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);

    const date = req.query.date || new Date();

    const food = req.query.food || "";

    let query = {};

    if (food) {
      query = {
        food: { $regex: food, $options: "i" },
      };
    }

    const data = await Food.find(query)
      .skip(start > 1 ? (start - 1) * limit : 0)
      .limit(limit);

    if (data.length === 0) {
      next(
        CreateSuccess(
          200,
          food !== "" ? "No food found" : "No food to load!",
          []
        )
      );
    } else {
      const goal = await Goal.findOne({
        user: req.user.id,
        fromDate: { $lte: date },
      });

      const foodData = data.map((food) => ({
        _id: food._id,
        name: food.food,
        quantity: 100,
        measurementUnit: "g",
        nutrients: {
          calories: food.calories,
          macronutrients: setMacronutrients(food, goal.macronutrients),
          micronutrients: setMicronutrients(food, goal.micronutrients),
        },
      }));
      
      next(CreateSuccess(200, "Food fetched successfully!", foodData));
    }
  } catch {
    next(CreateError(500, "Fetching food failed!"));
  }
};

exports.getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    const goal = await Goal.findOne({ user: req.user.id });

    const foodItem = {
      _id: food._id,
      name: food.food,
      quantity: 100,
      measurementUnit: "g",
      nutrients: {
        calories: food.calories,
        macronutrients: setMacronutrients(food, goal.macronutrients),
        micronutrients: setMicronutrients(food, goal.micronutrients),
      },
    };

    next(CreateSuccess(200, "Food fetched successfully!", foodItem));
  } catch {
    next(CreateError(500, "Fetching food failed!"));
  }
};