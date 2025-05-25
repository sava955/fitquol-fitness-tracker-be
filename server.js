import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import dashboardRoutes from "./routes/dashboard.js";
import exercisesRoutes from "./routes/exercises.js";
import rolesRoutes from "./routes/roles.js";
import mealsRoutes from "./routes/meals.js";
import foodRoutes from "./routes/food.js";
import diaryRoutes from "./routes/diary.js";
import recipesRoutes from "./routes/recipes.js";
import recipeCategoriesRoutes from "./routes/recipe-categories.js";
import goalsRoutes from "./routes/goals.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.set('trust proxy', true);

const mongoDBURL = process.env.MONGO_URL;

mongoose.connect(mongoDBURL)
  .then(() => console.log("Connected to database!"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/recipe-categories", recipeCategoriesRoutes);
app.use("/api/goals", goalsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((obj, req, res, next) => {
  const statusCode = obj.status || 500;
  const errorMessage = obj.message || "Something went wrong";
  return res.status(statusCode).json({
    success: [200, 201, 204].includes(obj.status),
    status: statusCode,
    message: errorMessage,
    data: obj.data
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
