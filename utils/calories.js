import { setNutrients } from './set-nutrients.js';

const calories = [
  {
    name: "Calories",
    key: "calories",
    value: 0,
    unitOfMeasurement: "µg",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
];

export function setCalories(food, caloriesRequired, servings) {
  return setNutrients(food, caloriesRequired, calories, servings);
}