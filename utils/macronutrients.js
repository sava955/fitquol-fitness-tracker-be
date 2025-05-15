import { setNutrients } from './set-nutrients.js';

const macronutrientsArr = [
  {
    name: "Calories",
    key: "calories",
    value: 0,
    unitOfMeasurement: "kCal",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "Carbohydrates",
    key: "carbohydrates",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "Protein",
    key: "protein",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "Fats",
    key: "fats",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "Net Carbs",
    key: "net_carbs",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "Fiber",
    key: "fiber",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "Saturated",
    key: "saturated",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "MUFA",
    key: "mufa",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "PUFA",
    key: "pufa",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "PUFA ω-3",
    key: "pufa_w3",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
  {
    name: "PUFA ω-6",
    key: "pufa_w6",
    value: 0,
    unitOfMeasurement: "g",
    percentageOfTotal: 0,
    dailyLimit: 0,
  },
];

export function setMacronutrients(food, macronutrients) {
  return setNutrients(food, macronutrients, macronutrientsArr);
}
