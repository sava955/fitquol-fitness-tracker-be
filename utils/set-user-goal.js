export async function setUserGoal(user) {
  const today = new Date();
  const birthDate = new Date(user.dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear();
  const gender = user.gender;
  const weight = user.weight;
  const height = user.height;

  let BMR;
  if (gender === "male") {
    BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    BMR = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    SUPER_ACTIVE: 1.9,
  };

  const TDEE = BMR * (activityMultipliers[user.activityLevel] || 1.2);

  const calorieAdjustment = (7700 * user.weightPerWeek) / 7;
  let caloriesRequired;

  switch (user.goal) {
    case "LOSE_WEIGHT":
      caloriesRequired = TDEE - calorieAdjustment;
      break;
    case "GAIN_WEIGHT":
      caloriesRequired = TDEE + calorieAdjustment;
      break;
    case "REMAIN_WEIGHT":
    default:
      caloriesRequired = TDEE;
      break;
  }

  // Macronutrient Needs
  const macronutrients = calculateMacronutrients(caloriesRequired, weight);

  // Micronutrient RDAs Based on Age & Gender
  const micronutrients = calculateMicronutrients(gender, age);

  return {
    caloriesRequired: caloriesRequired.toFixed(0),
    macronutrients,
    micronutrients,
  };
}

function calculateMacronutrients(caloriesRequired, weight) {
  return {
    calories: caloriesRequired,
    carbohydrates: (caloriesRequired * 0.5) / 4, // 50% of daily calories from carbs
    net_carbs: (caloriesRequired * 0.4) / 4, // 40% of daily calories from net carbs
    fiber: 30, // General fiber recommendation (g)
    fats: (caloriesRequired * 0.25) / 9, // 25% of daily calories from fat
    saturated: (caloriesRequired * 0.07) / 9, // Max 7% of daily calories from saturated fat
    mufa: (caloriesRequired * 0.1) / 9, // 10% of daily calories from monounsaturated fats
    pufa: (caloriesRequired * 0.08) / 9, // 8% of daily calories from polyunsaturated fats
    pufa_w6: (caloriesRequired * 0.05) / 9, // 5% omega-6
    pufa_w3: (caloriesRequired * 0.01) / 9, // 1% omega-3
    protein: weight * 1.6, // 1.6g per kg of body weight
  };
}

function calculateMicronutrients(gender, age) {
  return {
    vit_a_rae: gender === "male" ? 900 : 700, // mcg
    vit_a: gender === "male" ? 3000 : 2330, // IU
    vit_c: gender === "male" ? 90 : 75, // mg
    vit_d: age >= 51 ? 20 : 15, // mcg
    vit_e: 15, // mg
    vit_k: gender === "male" ? 120 : 90, // mcg
    vit_b1: age >= 51 ? 1.2 : 1.1, // mg
    vit_b2: gender === "male" ? 1.3 : 1.1, // mg
    vit_b3: gender === "male" ? 16 : 14, // mg
    vit_b5: 5, // mg
    vit_b6: age >= 51 ? (gender === "male" ? 1.7 : 1.5) : 1.3, // mg
    vit_b9: 400, // mcg
    vit_b12: 2.4, // mcg
    choline: gender === "male" ? 550 : 425, // mg
    betaine: 1000, // mg (estimated)
    calcium: age >= 51 ? 1200 : 1000, // mg
    copper: 0.9, // mg
    fluoride: gender === "male" ? 4000 : 3000, // mcg
    iron: gender === "male" ? 8 : age < 51 ? 18 : 8, // mg
    magnesium: gender === "male" ? 420 : 320, // mg
    manganese: gender === "male" ? 2.3 : 1.8, // mg
    phosphorus: 700, // mg
    potassium: 3400, // mg
    selenium: 55, // mcg
    sodium: 2300, // mg
    zinc: gender === "male" ? 11 : 8, // mg
  };
}
