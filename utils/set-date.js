export function setDate(date) {
  const d = new Date(date);
  const timezoneOffset = d.getTimezoneOffset();

  d.setHours(0, 0, 0, 0);
  d.setMinutes(d.getMinutes() - timezoneOffset); 

  return d.toISOString();
}
