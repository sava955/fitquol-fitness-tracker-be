const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");

require('dotenv').config();

const app = express();

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const dashboardRoutes = require("./routes/dashboard");
const exercisesRoutes = require("./routes/exercises");
const rolesRoutes = require("./routes/roles");
const mealsRoutes = require("./routes/meals");
const foodRoutes = require("./routes/food");
const diaryRoutes = require("./routes/diary");
const recipesRoutes = require("./routes/recipes");
const recipeCategoriesRoutes = require("./routes/recipe-categories");
const goalsRoutes = require("./routes/goals");

const path = require("path");

const mongoose = require("mongoose");
const mongoDBURL = process.env.MONGO_URL;

mongoose.connect(mongoDBURL).then(() => {
  console.log("Connected to database!");
});

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((obj, req, res, next) => {
  const statusCode = obj.status || 500;
  const errorMessage = obj.message || "Something went wrong";
  return res.status(statusCode).json({
    success: [200,201,204].some(a => a === obj.status) ? true : false,
    status: statusCode,
    message: errorMessage,
    data: obj.data
  });
});

app.listen(3000);
