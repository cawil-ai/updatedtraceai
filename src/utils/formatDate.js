//* This function accepts a UNIX timestamp (in milliseconds)
//* and converts it into a readable format
export default function formatDate(timestamp) {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  const day = date.getDate(); // Current Date
  const month = date.getMonth() + 1; // Current Month
  const year = date.getFullYear(); // Current Year
  const hours = date.getHours(); // Current Hours
  let min = date.getMinutes(); // Current Minutes
  min = min < 10 ? "0" + min : min;

  //? Other options for formatting include:
  //? Date.toLocaleString()
  //? RegEx
  //? DateTime libraries such as date-fns or moment.js
  return `${day}/${month}/${year} ${hours}:${min}`;
}
