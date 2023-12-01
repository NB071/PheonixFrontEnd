import variables from "./variables.js";

// === LOGIN ===
export function setUserInfo({user}) {
  return (variables.userInfo = user);
}

// ===DASHBOARD ===
// put the initial size of the array of task into the variable
export function initTempTaskArr(taskArr) {
  const filteredVisibility = taskArr.filter((item) => item.visibility);
  return (variables.tempTaskArray = filteredVisibility);
}

// Change the temporary array size of tasks
export function changeTempTaskArr(taskArr) {
  const filteredVisibility = taskArr.filter((item) => item.visibility);
  return (variables.tempTaskArray = filteredVisibility);
}

// Change the temporary array size of exams
export function initTempExamArr(examArr) {
  const filteredVisibility = examArr.filter((item) => item.visibility);
  return (variables.tempExamArray = filteredVisibility);
}
// put the initial size of the array of exams into the variable
export function changeTempExamArr(examArr) {
  const filteredVisibility = examArr.filter((item) => item.visibility);
  return (variables.tempExamArray = filteredVisibility);
}

// Rest all variables
export function resetVars() {
  variables.userInfo = null;
  variables.tempTaskArray = null;
  variables.tempExamArray = null;
}
