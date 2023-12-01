/**
 * Checks if a task or exam has passed its deadline.
 *
 * @function
 * @param {string} type - The type of the task or exam ("task" or "exam").
 * @param {Array<number|string>|Object} subjectTime - The time of the task or exam (if type is "task") or the due date (if type is "exam").
 * @param {number} subjectTime[0] - The hour of the task or exam.
 * @param {number} subjectTime[1] - The minute of the task or exam.
 * @param {string} subjectTime[2] - The period of the day (AM or PM) for the task.
 * @param {Object} subjectDate - The due date object (if type is "exam").
 * @param {number} subjectDate.day - The day of the month for the exam.
 * @param {number} subjectDate.month - The month for the exam.
 * @param {number} subjectDate.year - The year for the exam.
 * @returns {boolean} - True if the task or exam has passed its deadline, otherwise false.
 */
export function isTodoPassedDeadline(type, subjectTime, subjectDate) {
  const currentDate = new Date();

  // destruct due times
  const [dueHour, dueMinute, duePeriod] = subjectTime;

  // Return the result is type is task
  if (type === "task") {
    const [dueHour, dueMinute, duePeriod] = subjectTime;
    const dueTime = new Date();
    dueTime.setHours(
      duePeriod === "PM" ? dueHour + 12 : dueHour,
      dueMinute,
      0,
      0
    );

    // Compare |only| time
    return currentDate > dueTime;
  }

  // Additional check for type exam on dates
  if (type === "exam") {
    const { day, month, year } = subjectDate;
    const dueDate = new Date(
      `${month}/${day}/${year} ${dueHour}:${dueMinute} ${duePeriod}`
    );
    // Compare both |date| and |time|
    return currentDate > dueDate;
  }
}

/**
 * Generates a formatted string representing the visible due date for exams.
 *
 * @param {Date} date - The JavaScript Date object representing the due date.
 * @returns {string} The formatted due date string (e.g., "Thu-19-Nov 1:30").
 */export function formatExamDueDate(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthName = months[date.getMonth()];
  const hour = date.getHours();
  const min = date.getMinutes();

  return `${dayName}-${dayOfMonth}-${monthName} ${hour}:${min}`;
}

/**
 * Converts time from 12-hour format to 24-hour format.
 *
 * @param {number[]} timeArray - An array representing the time in 12-hour format.
 * @param {number} timeArray[0] - Hours.
 * @param {number} timeArray[1] - Minutes.
 * @param {string} timeArray[2] - Period ("AM" or "PM").
 * @returns {number[]} An array representing the time in 24-hour format.
 */
export function timeTo24([hours, minutes, period]) {
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return [hours, minutes];
}

/**
 * This function calculates the time difference between the current date and a due date, and ret string.
 *
 * @param {number[]} dueTime - An array containing the due time as [hour, minute, period].
 * @param {object} dueDay - An object containing the due day as { day, month, year }.
 * @returns {string} - A formatted string representing the time difference or "-" if the due time has passed.
 */
export function calculateExamDue(dueTime, dueDay) {
  const currentDate = new Date();
  const [dueHour, dueMinute, duePeriod] = dueTime;
  const { day, month, year } = dueDay;

  const dueDate = new Date(`${month}/${day}/${year} ${dueHour}:${dueMinute} ${duePeriod}`);
  const timeDifference = dueDate - currentDate;

  if (timeDifference < 0) {
      return "-";
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
      return `${days}d:${formatTime(hours)}h:${formatTime(mins)}m`;
  } else if (hours > 0) {
      return `${formatTime(hours)}h:${formatTime(mins)}m`;
  } else if (mins > 0) {
      return `${formatTime(mins)}m`;
  } else {
      return "-";
  }
}

/**
 * Formats the given time component by adding a leading zero if it's a single-digit number.
 *
 * @param {number} time - The time component to format.
 * @returns {string} - The formatted time component.
 */
function formatTime(time) {
  return time < 10 ? `0${time}` : `${time}`;
}