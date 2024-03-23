export const getNextDate = (daysToGo: number) => {
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + daysToGo);
  return nextDate;
};

export const getDateDifference = (previousDate: Date, format: string = "D") => {
  const currentDate: Date = new Date();
  if (format === "D" || format === "DAY") {
    const timeDifferenceInMilliseconds = +currentDate - +previousDate;
    return timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
  }
  return -1;
};
