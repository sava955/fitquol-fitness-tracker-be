export function setNutrients(food, nutrients, nutrientsArr, servings) {
  const nutrientsKeys = new Set(Object.keys(nutrients));
  const nutrientsData = nutrientsArr.map(m => ({ ...m }));

  let data = [];

  for (let key of nutrientsKeys) {
    const nutrientsDataItem = nutrientsData.find(
      (item) => item.key === key
    );

    if (nutrientsDataItem) {
      nutrientsDataItem.value = food[key] ? (servings ? food[key] / servings : food[key]) : 0;
      nutrientsDataItem.percentageOfTotal = 
        food[key] && nutrients[key] ? ((nutrientsDataItem.value / nutrients[key]) *
        100) : 0;
      nutrientsDataItem.dailyLimit = nutrients[key];

      data.push(nutrientsDataItem);
    }
  }
  
  return data;
}