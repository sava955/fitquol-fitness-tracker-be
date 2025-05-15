import RecipeCategory from "../models/recipe-category.js";

import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";

export const getRecipeCategories = async (req, res, next) => {
  try {
    const start = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);

    const name = req.query.name || "";

    let query = {};

    if (name) {
      query = {
        name: { $regex: name, $options: "i" },
      };
    }

    const data = await RecipeCategory.find(query)
      .skip(start > 1 ? (start - 1) * limit : 0)
      .limit(limit);

    if (data.length === 0) {
      next(
        CreateSuccess(
          200,
          name !== "" ? "No categories found" : "No categories to load!",
          []
        )
      );
    } else {
      next(CreateSuccess(200, "Category fetched successfully!", data));
    }
  } catch {
    next(CreateError(500, "Fetching categories failed!"));
  }
};
