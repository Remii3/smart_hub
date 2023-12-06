const calculateFutureDeleteDate = () => {
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let monthFromNow = currentMonth + 6;
  let futureDate = new Date(currentDate.getFullYear(), monthFromNow, 1);
  return futureDate.setDate(futureDate.getDate() - 1);
};
module.exports = calculateFutureDeleteDate;
