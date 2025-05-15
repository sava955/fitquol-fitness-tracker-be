import fs from "fs";
import path from "path";

import Recipe from "../models/recipe.js";
import RecipeCategory from "../models/recipe-category.js";
import Goal from "../models/goal.js";

import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

import { setMacronutrients } from "../utils/macronutrients.js";
import { setMicronutrients } from "../utils/micronutrients.js";

export const getRecipes = async (req, res, next) => {
  try {
    const start = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);

    const name = req.query.name || "";

    let query = {};

    if (name) {
      query = {
        ...query,
        name: { $regex: name, $options: "i" },
      };
    }

    const data = await Recipe.find(query)
      .populate("category")
      .skip(start > 1 ? (start - 1) * limit : 0)
      .limit(limit);

    if (data.length === 0) {
      next(
        CreateSuccess(
          200,
          name !== "" ? "No recipes found" : "No recipes to load!",
          []
        )
      );
    } else {
      const goal = await Goal.findOne({
        user: req.user.id,
        fromDate: { $lte: new Date() },
      });

      const recipeData = data.map((recipe) => ({
        ...recipe.toObject(),
        nutrients: {
          calories: recipe.nutrients.calories,
          macronutrients: setMacronutrients(
            recipe.nutrients,
            goal.macronutrients
          ),
          micronutrients: setMicronutrients(
            recipe.nutrients,
            goal.micronutrients
          ),
        },
      }));

      next(CreateSuccess(200, "Recipe fetched successfully!", recipeData));
    }
  } catch {
    next(CreateError(500, "Fetching recipes failed!"));
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("category");
    const goal = await Goal.findOne({
      user: req.user.id,
      fromDate: { $lte: new Date() },
    });

    const plainRecipe = recipe.toObject();

    const recipeData = {
      ...plainRecipe,
      nutrients: {
        calories: plainRecipe.nutrients.calories,
        macronutrients: setMacronutrients(
          plainRecipe.nutrients,
          goal.macronutrients
        ),
        micronutrients: setMicronutrients(
          plainRecipe.nutrients,
          goal.micronutrients
        ),
      },
    };

    next(CreateSuccess(200, "Recipe fetched successfully!", recipeData));
  } catch {
    next(CreateError(500, "Fetching recipe failed!"));
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const user = req.user;
    const url = req.protocol + "://" + req.get("host");

    if (req.body.category) {
      req.body.category = JSON.parse(req.body.category);
    }
    if (req.body.ingredients) {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }
    if (req.body.instructions) {
      req.body.instructions = JSON.parse(req.body.instructions);
    }
    if (req.body.nutrients) {
      req.body.nutrients = JSON.parse(req.body.nutrients);
    }

    const newRecipe = new Recipe({
      ...req.body,
      image: url + "/uploads/" + req.file.filename,
      createdBy: user.id,
    });

    await newRecipe.save();
    await RecipeCategory.findOneAndUpdate(
      { _id: newRecipe.category._id },
      { $push: { recipes: newRecipe._id } }
    );

    next(
      CreateSuccess(200, "Recipe created successfully!", { _id: newRecipe._id })
    );
  } catch {
    next(CreateError(500, "Failed to create recipe!"));
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    const url = req.protocol + "://" + req.get("host");

    if (req.user.id !== recipe.createdBy.toString()) {
      return next(
        CreateError(401, "You are not allowed to modify this recipe!")
      );
    }

    if (req.body.category) {
      req.body.category = JSON.parse(req.body.category);
    }

    if (req.body.ingredients) {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }

    if (req.body.instructions) {
      req.body.instructions = JSON.parse(req.body.instructions);
    }

    if (req.body.nutrients) {
      req.body.nutrients = JSON.parse(req.body.nutrients);
    }

    if (req.file) {
      const newImageFilename = req.file.filename;

      if (recipe.image) {
        const oldImageFilename = path.basename(recipe.image);
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          oldImageFilename
        );

        if (oldImageFilename !== newImageFilename) {
          fs.unlink(oldImagePath, (err) => {
            if (err && err.code !== "ENOENT") {
              console.error("Failed to delete old image:", err);
            } else {
              console.log("Old image deleted:", oldImageFilename);
            }
          });
        }
      }
      req.body.image = url + "/uploads/" + req.file.filename;
    }

    if (recipe.category !== req.body.category._id) {
      await RecipeCategory.findOneAndUpdate(
        { _id: recipe.category },
        { $pull: { recipes: id } }
      );
      await RecipeCategory.findOneAndUpdate(
        { _id: req.body.category._id },
        { $push: { recipes: id } }
      );
    }

    await recipe.updateOne(req.body);

    next(CreateSuccess(200, "Recipe updated successfully!", recipe));
  } catch {
    next(CreateError(200, "Recipe update faild!"));
  }
};

export const deleteRecipe = async (req, res, next) => {
  const id = req.params.id;
  const recipe = await Recipe.findById(id);

  await RecipeCategory.findOneAndUpdate(
    { _id: recipe.category },
    { $pull: { recipes: id } },
    { new: true }
  );

  Recipe.findByIdAndDelete(id)
    .then((data) => {
      if (data.image) {
        const filename = path.basename(data.image);
        const imagePath = path.join(__dirname, "..", "uploads", filename);
        fs.unlink(imagePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Error deleting file:", err);
          } else {
            console.log("Image deleted:", data.image);
          }
        });
      }
      next(CreateSuccess(200, "Recipe deleted successfully!", data));
    })
    .catch(() => {
      next(CreateError(500, "Recipe delete failed!"));
    });
};
