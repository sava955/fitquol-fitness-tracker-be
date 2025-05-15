export function noDataToLoad(param, data) {
  if (data.length === 0) {
    if (param !== "") {
      return CreateError(404, "Data not found");
    } else {
      return CreateError(204, "No more data to load!");
    }
  }
}
