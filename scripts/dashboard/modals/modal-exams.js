import { createModal } from "../../helpers/manageModal.js";
import { handleCloseModal } from "../../helpers/manageModal.js";
import { isTodoPassedDeadline } from "../../helpers/due.js";
import {
  onBlurDay,
  onBlurHour,
  onBlurMinute,
  onBlurMonth,
  onBlurYear,
} from "../../helpers/inputs.js";
import { fetchUserData } from "../todos.js";
import redirect from "../../utils/redirect.js";
import { resetVars } from "../../variables/reducers.js";

/**
 * Opens the modal for adding a exam.
 * @function openAddExam
 * @returns {void}
 */
export function openAddExam() {
  const [modal, modalBox] = createModal({
    modalClass: "add-exam",
    modalIconClass: ["fa-solid", "fa-book-open-reader"],
    modalTitle: "Add a Exam/Assignment",
    modalDescription:
      "Create your exams precisely and see that in your main dashboard and never miss them",
  });
  modal.setAttribute("open", "");

  // Form content
  const form = document.createElement("form");
  form.setAttribute("method", "dialog");
  form.classList.add("add-exam__form");

  const nameWrapper = document.createElement("div");
  nameWrapper.classList.add("add-exam__name-wrapper");

  const nameText = document.createElement("label");
  nameText.classList.add("add-exam__name-text");
  nameText.textContent = "Name *";

  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "name");
  nameInput.classList.add("input");
  nameInput.setAttribute("placeholder", "Calculus");

  nameWrapper.append(nameText, nameInput);

  // Select wrapper - second row
  const selectWrapper = document.createElement("div");
  selectWrapper.classList.add("add-exam__select-inputs");

  // Type wrapper
  const typeWrapper = document.createElement("div");
  typeWrapper.classList.add("add-exam__type-wrapper");

  const typeText = document.createElement("label");
  typeText.classList.add("add-exam__type-text");
  typeText.textContent = "Type *";

  const typeSelect = document.createElement("select");
  typeSelect.setAttribute("name", "type");
  typeSelect.classList.add("add-exam__type");

  const typeOption1 = document.createElement("option");
  typeOption1.setAttribute("value", "Test");
  typeOption1.setAttribute("selected", "");
  typeOption1.textContent = "Test";

  const typeOption2 = document.createElement("option");
  typeOption2.setAttribute("value", "Assignment");
  typeOption2.textContent = "Assignment";

  // Append options to priority select
  typeSelect.append(typeOption1, typeOption2);

  // Append priority select and text to its wrappper
  typeWrapper.append(typeText, typeSelect);

  // Grade wrapper A+, A, B+ ...
  const gradeWrapper = document.createElement("div");
  gradeWrapper.classList.add("add-exam__grade-wrapper");

  const gradeText = document.createElement("label");
  gradeText.classList.add("add-exam__type-text");
  gradeText.textContent = "Grade *";

  const gradeSelect = document.createElement("select");
  gradeSelect.setAttribute("name", "grade");

  // disabled in add mode.
  gradeSelect.setAttribute("disabled", "");

  gradeSelect.classList.add("add-exam__grade");
  gradeSelect.setAttribute("disabled", "");

  // Loop through the list of grade letters and generate options for the select element
  const gradeOptions = [
    "-",
    "A+",
    "A",
    "B+",
    "B",
    "C+",
    "C",
    "D+",
    "D",
    "E",
    "F",
  ];
  gradeOptions.forEach((gradeLetter) => {
    const gradeOption = document.createElement("option");
    gradeOption.setAttribute("value", gradeLetter);
    if (gradeOption === "-") {
      gradeOption.setAttribute("disbabled", "");
    }
    gradeOption.textContent = gradeLetter;
    gradeSelect.appendChild(gradeOption);
  });

  // Append label the select to the grade wrapper
  gradeWrapper.append(gradeText, gradeSelect);

  // Guess wrapper - WELL, GOOD, BAD
  const guessWrapper = document.createElement("div");
  guessWrapper.classList.add("add-exam__guess-wrapper");

  const guessText = document.createElement("label");
  guessText.classList.add("add-exam__type-text");
  guessText.textContent = "Guess *";

  const guessSelect = document.createElement("select");
  guessSelect.setAttribute("name", "guess");
  guessSelect.classList.add("add-exam__guess");

  // Loop through the list of 3 guesses and generate options for the select element
  const guessOptions = ["-", "WELL", "GOOD", "BAD"];
  guessOptions.forEach((guessLetter) => {
    const guessOption = document.createElement("option");
    guessOption.setAttribute("value", guessLetter);
    if (guessOption === "-") {
      guessOption.setAttribute("disbabled", "");
    }
    guessOption.textContent = guessLetter;
    guessSelect.appendChild(guessOption);
  });

  // disabled in add mode.
  guessSelect.setAttribute("disabled", "");

  // Append label the select to the guess wrapper
  guessWrapper.append(guessText, guessSelect);

  // Append Type & Grade & Guess wrappers -> Select wrapper
  selectWrapper.append(typeWrapper, gradeWrapper, guessWrapper);

  // Due wrapper
  const dueWrapper = document.createElement("div");
  dueWrapper.classList.add("add-exam__due-wrapper");

  const dueText = document.createElement("label");
  dueText.classList.add("add-exam__due-text");
  dueText.textContent = "Due *";

  const dueInputs = document.createElement("div");
  dueInputs.classList.add("add-exam__due-inputs");

  const dueHourInput = document.createElement("input");
  dueHourInput.setAttribute("type", "number");
  dueHourInput.setAttribute("name", "due_hour");
  dueHourInput.setAttribute("min", 0);
  dueHourInput.setAttribute("max", 23);
  dueHourInput.classList.add("input");
  dueHourInput.setAttribute("placeholder", "hour");
  dueHourInput.addEventListener("blur", (e) => onBlurHour(e));

  const colonText = document.createTextNode(":");

  const dueMinuteInput = document.createElement("input");
  dueMinuteInput.setAttribute("type", "number");
  dueMinuteInput.setAttribute("name", "due_minute");
  dueMinuteInput.setAttribute("min", 0);
  dueMinuteInput.setAttribute("max", 59);
  dueMinuteInput.classList.add("input");
  dueMinuteInput.setAttribute("placeholder", "minutes");
  dueMinuteInput.addEventListener("blur", (e) => onBlurMinute(e));

  const duePeriodSelect = document.createElement("select");
  duePeriodSelect.setAttribute("name", "due__period");
  duePeriodSelect.classList.add("add-exam__to-period");

  const amOption = document.createElement("option");
  amOption.setAttribute("value", "AM");
  amOption.textContent = "AM";

  const pmOption = document.createElement("option");
  pmOption.setAttribute("value", "PM");
  pmOption.textContent = "PM";

  duePeriodSelect.append(amOption, pmOption);

  dueInputs.append(dueHourInput, colonText, dueMinuteInput, duePeriodSelect);

  dueWrapper.append(dueText, dueInputs);

  // Date wrapper
  const dateWrapper = document.createElement("div");
  dateWrapper.classList.add("add-exam__date");

  // Date text
  const dateText = document.createElement("label");
  dateText.classList.add("add-exam__date-text");
  dateText.textContent = "Date *";

  // Input wrapper
  const dateInputs = document.createElement("div");
  dateInputs.classList.add("add-exam__date-inputs");

  // Date/DD
  const dateDayInput = document.createElement("input");
  dateDayInput.setAttribute("type", "number");
  dateDayInput.setAttribute("name", "date_day");
  dateDayInput.classList.add("input");
  dateDayInput.setAttribute("min", "1");
  dateDayInput.setAttribute("max", "31");
  dateDayInput.setAttribute("placeholder", "DD");
  dateDayInput.addEventListener("blur", (e) => onBlurDay(e));

  // Slash
  const slashText1 = document.createTextNode("/");

  // Date/MM
  const dateMonthInput = document.createElement("input");
  dateMonthInput.setAttribute("type", "number");
  dateMonthInput.setAttribute("name", "date_month");
  dateMonthInput.classList.add("input");
  dateMonthInput.setAttribute("min", "1");
  dateMonthInput.setAttribute("max", "12");
  dateMonthInput.setAttribute("placeholder", "MM");
  dateMonthInput.addEventListener("blur", (e) => onBlurMonth(e));

  // Slash
  const slashText2 = document.createTextNode("/");

  // Date/YY
  const dateYearInput = document.createElement("input");
  dateYearInput.setAttribute("type", "number");
  dateYearInput.setAttribute("name", "date_year");
  dateYearInput.classList.add("input");
  dateYearInput.setAttribute("min", new Date().getFullYear());
  dateYearInput.setAttribute("placeholder", "YYYY");
  dateYearInput.addEventListener("blur", (e) => onBlurYear(e));

  dateInputs.append(
    dateDayInput,
    slashText1,
    dateMonthInput,
    slashText2,
    dateYearInput
  );

  // Append all inputs to the date wrapper
  dateWrapper.append(dateText, dateInputs);

  // Button wrapper
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("add-exam__button-wrapper");

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("button--secondary");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (e) => handleCloseModal(e));

  const addButton = document.createElement("button");
  addButton.classList.add("button--primary");
  addButton.textContent = "Add";
  addButton.addEventListener("click", (e) => handleAddExam(e));

  buttonWrapper.append(cancelButton, addButton);

  // Append all modal elements to the form
  form.append(
    nameWrapper,
    selectWrapper,
    dueWrapper,
    dateWrapper,
    buttonWrapper
  );

  // Append all the divs to the modal box
  modalBox.appendChild(form);

  // Append modal box to modal overlay
  modal.appendChild(modalBox);

  // Append modal overlay to the document body
  document.body.prepend(modal);
}

export function openModifyExam({ id, name, type, result, due }) {
  const isPassedDeadline = isTodoPassedDeadline("exam", due.time, due.date);
  const { day: dueDay, month: dueMonth, year: dueYear } = due.date;
  const [dueHour, dueMinute, duePeriod] = due.time;

  const [modal, modalBox] = createModal({
    modalClass: "modify-exam",
    modalIconClass: ["fa-solid", "fa-book-open-reader"],
    modalTitle: "Modify a Exam/Assignment",
    modalDescription:
      "Modify your exams precisely and see that in your main dashboard and never miss them",
  });
  modal.setAttribute("open", "");

  // Form content
  const form = document.createElement("form");
  form.setAttribute("method", "dialog");
  form.classList.add("modify-exam__form");

  const nameWrapper = document.createElement("div");
  nameWrapper.classList.add("modify-exam__name-wrapper");

  const nameText = document.createElement("label");
  nameText.classList.add("modify-exam__name-text");
  nameText.textContent = "Name *";

  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "name");
  nameInput.classList.add("input");
  nameInput.setAttribute("placeholder", "Calculus");
  nameInput.value = name;

  nameWrapper.append(nameText, nameInput);

  // Select wrapper - second row
  const selectWrapper = document.createElement("div");
  selectWrapper.classList.add("modify-exam__select-inputs");

  // Type wrapper
  const typeWrapper = document.createElement("div");
  typeWrapper.classList.add("modify-exam__type-wrapper");

  const typeText = document.createElement("label");
  typeText.classList.add("modify-exam__type-text");
  typeText.textContent = "Type *";

  const typeSelect = document.createElement("select");
  typeSelect.setAttribute("name", "type");
  typeSelect.classList.add("modify-exam__type");
  typeSelect.value = type;

  const typeOption1 = document.createElement("option");
  typeOption1.setAttribute("value", "Test");
  typeOption1.textContent = "Test";
  if (type === "Test") {
    typeOption1.setAttribute("selected", "");
  }

  const typeOption2 = document.createElement("option");
  typeOption2.setAttribute("value", "Assignment");
  typeOption2.textContent = "Assignment";
  if (type === "Assignment") {
    typeOption2.setAttribute("selected", "");
  }

  // Append options to priority select
  typeSelect.append(typeOption1, typeOption2);

  // Append priority select and text to its wrappper
  typeWrapper.append(typeText, typeSelect);

  // Grade wrapper A+, A, B+ ...
  const gradeWrapper = document.createElement("div");
  gradeWrapper.classList.add("modify-exam__grade-wrapper");

  const gradeText = document.createElement("label");
  gradeText.classList.add("modify-exam__type-text");
  gradeText.textContent = "Grade *";

  const gradeSelect = document.createElement("select");
  gradeSelect.setAttribute("name", "grade");
  gradeSelect.classList.add("modify-exam__grade");

  if (!isPassedDeadline) {
    gradeSelect.setAttribute("disabled", "");
  } else {
    gradeSelect.value = result?.grade || "-";
  }

  // Loop through the list of grade letters and generate options for the select element
  const gradeOptions = [
    "-",
    "A+",
    "A",
    "B+",
    "B",
    "C+",
    "C",
    "D+",
    "D",
    "E",
    "F",
  ];
  gradeOptions.forEach((gradeLetter) => {
    const gradeOption = document.createElement("option");
    gradeOption.setAttribute("value", gradeLetter);
    if (gradeOption === "-") {
      gradeOption.setAttribute("disbabled", "");
    }
    if (gradeLetter === result?.grade) {
      gradeOption.setAttribute("selected", "");
    }
    gradeOption.textContent = gradeLetter;
    gradeSelect.appendChild(gradeOption);
  });

  // Append label the select to the grade wrapper
  gradeWrapper.append(gradeText, gradeSelect);

  // Guess wrapper WELL, GOOD, BAD
  const guessWrapper = document.createElement("div");
  guessWrapper.classList.add("modify-exam__guess-wrapper");

  const guessText = document.createElement("label");
  guessText.classList.add("modify-exam__type-text");
  guessText.textContent = "Guess *";

  const guessSelect = document.createElement("select");
  guessSelect.setAttribute("name", "guess");
  guessSelect.classList.add("modify-exam__guess");
  if (!isPassedDeadline || result?.guess) {
    guessSelect.setAttribute("disabled", "");
  } else {
    guessSelect.value = result?.guess || "-";
  }

  // Loop through the list of 3 guesses and generate options for the select element
  const guessOptions = ["-", "WELL", "GOOD", "BAD"];
  guessOptions.forEach((guessLetter) => {
    const guessOption = document.createElement("option");
    guessOption.setAttribute("value", guessLetter);
    if (guessOption === "-") {
      guessOption.setAttribute("disbabled", "");
    }
    if (guessLetter === result?.guess) {
      guessOption.setAttribute("selected", "");
    }
    guessOption.textContent = guessLetter;
    guessSelect.appendChild(guessOption);
  });
  // Append label the select to the guess wrapper
  guessWrapper.append(guessText, guessSelect);

  // Append Type & Grade & Guess wrappers -> Select wrapper
  selectWrapper.append(typeWrapper, gradeWrapper);

  // Due wrapper
  const dueWrapper = document.createElement("div");
  dueWrapper.classList.add("modify-exam__due-wrapper");

  const dueText = document.createElement("label");
  dueText.classList.add("modify-exam__due-text");
  dueText.textContent = "Due *";

  const dueInputs = document.createElement("div");
  dueInputs.classList.add("modify-exam__due-inputs");

  const dueHourInput = document.createElement("input");
  dueHourInput.setAttribute("type", "number");
  dueHourInput.setAttribute("min", 0);
  dueHourInput.setAttribute("max", 23);
  dueHourInput.setAttribute("name", "due_hour");
  dueHourInput.classList.add("input");
  dueHourInput.setAttribute("placeholder", "hour");
  dueHourInput.value = dueHour;
  dueHourInput.addEventListener("blur", (e) => onBlurHour(e));

  const colonText = document.createTextNode(":");

  const dueMinuteInput = document.createElement("input");
  dueMinuteInput.setAttribute("type", "number");
  dueMinuteInput.setAttribute("name", "due_minute");
  dueMinuteInput.setAttribute("min", 0);
  dueMinuteInput.setAttribute("max", 59);
  dueMinuteInput.classList.add("input");
  dueMinuteInput.setAttribute("placeholder", "minutes");
  dueMinuteInput.value = dueMinute;
  dueMinuteInput.addEventListener("blur", (e) => onBlurMinute(e));

  const duePeriodSelect = document.createElement("select");
  duePeriodSelect.setAttribute("name", "due__period");
  duePeriodSelect.classList.add("modify-exam__to-period");
  duePeriodSelect.value = duePeriod;

  const amOption = document.createElement("option");
  amOption.setAttribute("value", "AM");
  amOption.textContent = "AM";
  if (duePeriod === "AM") {
    amOption.setAttribute("selected", "");
  }

  const pmOption = document.createElement("option");
  pmOption.setAttribute("value", "PM");
  pmOption.textContent = "PM";
  if (duePeriod === "PM") {
    pmOption.setAttribute("selected", "");
  }

  duePeriodSelect.append(amOption, pmOption);

  dueInputs.append(dueHourInput, colonText, dueMinuteInput, duePeriodSelect);

  dueWrapper.append(dueText, dueInputs);

  // Date wrapper
  const dateWrapper = document.createElement("div");
  dateWrapper.classList.add("modify-exam__date");

  // Date text
  const dateText = document.createElement("label");
  dateText.classList.add("modify-exam__date-text");
  dateText.textContent = "Date *";

  // Input wrapper
  const dateInputs = document.createElement("div");
  dateInputs.classList.add("modify-exam__date-inputs");

  // Date/DD
  const dateDayInput = document.createElement("input");
  dateDayInput.setAttribute("type", "number");
  dateDayInput.setAttribute("name", "date_day");
  dateDayInput.classList.add("input");
  dateDayInput.setAttribute("min", 1);
  dateDayInput.setAttribute("max", 31);
  dateDayInput.setAttribute("placeholder", "DD");
  dateDayInput.value = dueDay;
  dateDayInput.addEventListener("blur", (e) => onBlurDay(e));

  // Slash
  const slashText1 = document.createTextNode("/");

  // Date/MM
  const dateMonthInput = document.createElement("input");
  dateMonthInput.setAttribute("type", "number");
  dateMonthInput.setAttribute("name", "date_month");
  dateMonthInput.classList.add("input");
  dateMonthInput.setAttribute("min", 1);
  dateMonthInput.setAttribute("max", 12);
  dateMonthInput.setAttribute("placeholder", "MM");
  dateMonthInput.value = dueMonth;
  dateMonthInput.addEventListener("blur", (e) => onBlurMonth(e));

  // Slash
  const slashText2 = document.createTextNode("/");

  // Date/YY
  const dateYearInput = document.createElement("input");
  dateYearInput.setAttribute("type", "number");
  dateYearInput.setAttribute("name", "date_year");
  dateYearInput.classList.add("input");
  dateYearInput.setAttribute("min", new Date().getFullYear());
  dateYearInput.setAttribute("placeholder", "YYYY");
  dateYearInput.value = dueYear;
  dateYearInput.addEventListener("blur", (e) => onBlurYear(e));

  dateInputs.append(
    dateDayInput,
    slashText1,
    dateMonthInput,
    slashText2,
    dateYearInput
  );

  // Append all inputs to the date wrapper
  dateWrapper.append(dateText, dateInputs);

  // Button wrapper
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("modify-exam__button-wrapper");

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("button--secondary");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (e) => handleCloseModal(e));

  const addButton = document.createElement("button");
  addButton.classList.add("button--primary");
  addButton.textContent = "Modify";
  addButton.addEventListener("click", (e) => handleModifyExam(e, id));

  buttonWrapper.append(cancelButton, addButton);

  // Append all modal elements to the form
  form.append(
    nameWrapper,
    selectWrapper,
    guessWrapper,
    dueWrapper,
    dateWrapper,
    buttonWrapper
  );

  // Append all the divs to the modal box
  modalBox.appendChild(form);

  // Append modal box to modal overlay
  modal.appendChild(modalBox);

  // Append modal overlay to the document body
  document.body.appendChild(modal);
}

/**
 * POST REQUEST: Handles the addition of an exam based on the form input values.
 *
 * @function handleAddExam
 * @returns {void} Returns undefined.
 */
async function handleAddExam(e) {
  const formElements = document.querySelector(".add-exam__form").elements;

  // Extract only the inputs wanted to be sent and check if they're not empty
  const isAnyFieldEmpty = Array.from(formElements)
    .slice(0, 10)
    .some((element) => element.value === "");

  if (isAnyFieldEmpty) {
    // Filter the empty fields and place invalid class to them
    const emptyFields = Array.from(formElements)
      .slice(0, 10)
      .filter((element) => element.value === "");
    emptyFields.forEach((element) => {
      element.classList.add("input--invalid");
    });

    return alert("Please fill all the inputs");
  }
  // Creating object for POST request
  const requestObj = {
    name: formElements[0].value,
    type: formElements[1].value,
    result: {
      grade: formElements[2].value,
      guess: formElements[3].value,
    },
    due: {
      // HH:MM:AM/PM
      time: [
        parseInt(formElements[4].value), // HH
        parseInt(formElements[5].value), // MM
        formElements[6].value, // AM/PM
      ],
      // DD:MM:YY
      date: {
        day: parseInt(formElements[7].value), // DD
        month: parseInt(formElements[8].value), // MM
        year: parseInt(formElements[9].value), // YY
      },
    },
  };

  const token = localStorage.getItem("token");
  try {
    await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/api/todos/exams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(requestObj),
    });

    handleCloseModal(e);
    alert("exam has been successfully added");

    await fetchUserData(token.split(" ")[1]);
  } catch (err) {
    localStorage.clear("token");
    resetVars();
    redirect("/pages/login");
    return console.error("Error while adding the exam");
  }
}

/**
 * PUT REQUEST: Handles the modification of an exam based on the form input values.
 *
 * @function handleModifyExam
 * @returns {void} Returns undefined.
 */
async function handleModifyExam(e, id) {
  const formElements = document.querySelector(".modify-exam__form").elements;

  // Extract only the inputs wanted to be sent and check if they're not empty
  const isAnyFieldEmpty = Array.from(formElements)
    .slice(0, 10)
    .some((element) => element.value === "");

  if (isAnyFieldEmpty) {
    // Filter the empty fields and place invalid class to them
    const emptyFields = Array.from(formElements)
      .slice(0, 10)
      .filter((element) => element.value === "");
    emptyFields.forEach((element) => {
      element.classList.add("input--invalid");
    });

    return alert("Please fill all the inputs");
  }

  // Creating object for POST request
  const requestObj = {
    exam_id: id,
    name: formElements[0].value,
    type: formElements[1].value,
    result: {
      grade: formElements[2].value,
      guess: formElements[3].value,
    },
    due: {
      // HH:MM:AM/PM
      time: [
        parseInt(formElements[4].value), // HH
        parseInt(formElements[5].value), // MM
        formElements[6].value, // AM/PM
      ],
      // DD:MM:YY
      date: {
        day: parseInt(formElements[7].value), // DD
        month: parseInt(formElements[8].value), // MM
        year: parseInt(formElements[9].value), // YY
      },
    },
  };

  const token = localStorage.getItem("token");
  try {
    await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/api/todos/exams", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(requestObj),
    });

    handleCloseModal(e);

    // check if the see all modal is open, close it if opened
    const seeAllExam = document.querySelector(".SA-exams[open]")
    seeAllExam && handleCloseModal(e);
    
    alert("exam has been successfully modified");

    await fetchUserData(token.split(" ")[1]);
  } catch (err) {
    localStorage.clear("token");
    resetVars();
    redirect("/pages/login");
    return console.error("Error while modifing the exam");
  }
}
