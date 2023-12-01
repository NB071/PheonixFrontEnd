import {
  formatExamDueDate,
  isTodoPassedDeadline,
  timeTo24,
} from "../helpers/due.js";
import { openModifyTask, openAddTask } from "./modals/Modal-task.js";
import { openAddExam, openModifyExam } from "./modals/modal-exams.js";
import variables from "../variables/variables.js";
import {
  changeTempTaskArr,
  initTempTaskArr,
  changeTempExamArr,
  initTempExamArr,
  resetVars,
} from "../variables/reducers.js";
import openSATasks from "./modals/modal-SA-tasks.js";
import redirect from "../utils/redirect.js";
import openSAExams from "./modals/modal-SA-exams.js";

/**
 * Handles the closure of a task card by removing it from the DOM and updating the task array.
 *
 * @function handleCloseTaskCard
 * @param {string} id - The ID of the task card to be closed.
 * @returns {void} Returns undefined.
 */
function handleCloseTaskCard(id) {
  // If the deleted card is the only task present
  if (variables.tempTaskArray.length === 1) {
    // Remove the card
    document.querySelector(`article.task[key="task-P${id}X"]`).remove();

    // Call the function again, however, with no tasks
    // It generates the default card
    return placeTasks([]);
  } else {
    // else_ If there are more than 1 card present just delete the card
    // filter the array and store it in state variable
    const filteredArraySize = variables.tempTaskArray.filter(
      (task) => task.id !== id
    );
    changeTempTaskArr(filteredArraySize);

    return document.querySelector(`article.task[key="task-P${id}X"]`).remove();
  }
}

/**
 * Handles the closure of an exam card by removing it from the DOM and updating the exam array.
 *
 * @function handleCloseExamCard
 * @param {string} id - The ID of the exam card to be closed.
 * @returns {void} Returns undefined.
 */
function handleCloseExamCard(e, id) {
  e.stopPropagation();
  // If the deleted card is the only exam present
  if (variables.tempExamArray.length === 1) {
    // Remove the card
    document.querySelector(`article.exam[key="exam-P${id}X"]`).remove();

    // Call the function again, however, with no exam
    // It generates the default card
    return placeExams([]);
  } else {
    // else_ If there are more than 1 card present just delete the card
    // filter the array and store it in state variable
    const filteredArraySize = variables.tempExamArray.filter(
      (exam) => exam.id !== id
    );
    changeTempExamArr(filteredArraySize);
    return document.querySelector(`article.exam[key="exam-P${id}X"]`).remove();
  }
}

/**
 * Updates the displayed guess message based on the user's choice.
 *
 * @param {string} id - The identifier of the exam.
 * @param {string} choice - The user's guess choice ("BAD", "OK", or "WELL").
 * @returns {void}
 */
function displayGuessMessage(id, choice) {
  const guessWrapper = document.querySelector(
    `article.exam--finished[key="exam-P${id}X"] > .exam__container >  .exam__guess-wrapper`
  );

  // Remove the button wrapper
  guessWrapper.childNodes[1].remove();

  // Change the text class and content beside it.
  switch (choice) {
    case "BAD":
      guessWrapper.childNodes[0].textContent =
        "Sorry to hear that! try harder next time";
      break;

    case "OK":
      guessWrapper.childNodes[0].textContent = "Cool! you got it next time.";
      break;

    case "WELL":
      guessWrapper.childNodes[0].textContent =
        "Excellent! Keep up the good work";
      break;

    default:
      return console.error("incorrect given choice");
  }
  // Exchange the classes
  guessWrapper.childNodes[0].classList.remove("exam__guess-text");
  guessWrapper.childNodes[0].classList.add("exam__guess-result");
}

// sends the guess data to the backend
async function handleExamGuess(id, ans, grade) {
  const token = localStorage.getItem("token");
  try {
    await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/api/todos/exams", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        exam_id: id,
        visibility: false,
        result: {
          guess: ans,
          grade: grade,
        },
      }),
    });
  } catch (err) {
    localStorage.clear("token");
    resetVars();
    redirect("/pages/login");
    return console.error("Error while putting guess for the exam");
  }
}

/**
 * Handles the "OK" button click for a finished exam.
 *
 * @param {string} id - The identifier of the exam.
 * @returns {Promise<void>}
 */
async function handeOkButton(e, id, result) {
  e.preventDefault();
  const articleCard = document.querySelector(
    `article.exam--finished[key="exam-P${id}X"] `
  );

  await handleExamGuess(id, "OK", result.grade);
  displayGuessMessage(id, "OK");

  const token = localStorage.getItem("token").split(" ")[1];

  // refresh
  setTimeout(() => {
    fetchUserData(token);
  }, 2000);
}

/**
 * Handles the "BAD" button click for a finished exam.
 *
 * @param {string} id - The identifier of the exam.
 * @returns {Promise<void>}
 */
async function handeBadButton(e, id, result) {
  e.preventDefault();

  const articleCard = document.querySelector(
    `article.exam--finished[key="exam-P${id}X"] `
  );

  await handleExamGuess(id, "BAD", result.grade);
  displayGuessMessage(id, "BAD");

  const token = localStorage.getItem("token").split(" ")[1];

  // refresh
  setTimeout(() => {
    fetchUserData(token);
  }, 2000);
}

/**
 * Handles the "WELL" button click for a finished exam.
 *
 * @param {string} id - The identifier of the exam.
 * @returns {Promise<void>}
 */
async function handeWellButton(e, id, result) {
  e.preventDefault();
  const articleCard = document.querySelector(
    `article.exam--finished[key="exam-P${id}X"] `
  );

  await handleExamGuess(id, "WELL", result.grade);
  displayGuessMessage(id, "WELL");

  const token = localStorage.getItem("token").split(" ")[1];

  // refresh
  setTimeout(() => {
    fetchUserData(token);
  }, 2000);
}

/**
 * Generates a starter card when no tasks are present or available.
 * @param {HTMLElement} taskSection - The HTML element representing the section where the starter card will be appended.
 * @returns {void} - The function does not return a value.
 */
function createStarterTaskCard(taskSection) {
  // create parent article
  const articleElement = document.createElement("article");
  articleElement.classList.add("task", "task--starter");

  // Child => create starter icon
  const icon = document.createElement("i");
  icon.setAttribute("alt", "task icon");
  icon.classList.add("task__icon", "fa-solid", "fa-school");

  // inner info Child < Parent
  const innerDivElement = document.createElement("div");
  innerDivElement.classList.add("task__info");

  // title
  const innerDivTitle = document.createElement("p");
  innerDivTitle.textContent = "Upcoming tasks";
  innerDivTitle.classList.add("task__title");

  // description
  const innerDivDescription = document.createElement("p");
  innerDivDescription.classList.add("task__description");
  innerDivDescription.textContent =
    "Currently you don’t have any visible task at hand. to create on click the button below";

  // CTA button < parent
  const ctaButton = document.createElement("button");
  ctaButton.classList.add("button__cta");
  ctaButton.textContent = "Create your first task";

  ctaButton.addEventListener("click", () => openAddTask());

  // plus icon for button Child
  const plusIcon = document.createElement("i");
  plusIcon.classList.add("fa-light", "fa-plus");

  // append plus icon
  ctaButton.append(plusIcon);

  // append inner div
  innerDivElement.append(innerDivTitle, innerDivDescription, ctaButton);

  // append to otter article
  articleElement.append(icon, innerDivElement);

  // apped to section
  return taskSection.append(articleElement);
}

// Request backend for mark as done
async function handleMDone(e, id) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  try {
    await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/api/todos/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        task_id: id,
        done: true,
        visibility: false,
      }),
    });
    await fetchUserData(token.split(" ")[1]);
    alert("Your task has been set as done");
  } catch (error) {
    localStorage.clear("token");
    resetVars();
    redirect("/pages/login");
  }
}

// Request backend for mark as done
async function handleDeleteTask(e, id) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  try {
    await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/api/todos/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        task_id: id,
      }),
    });
    await fetchUserData(token.split(" ")[1]);
    alert("Your task has been successfully deleted");
  } catch (error) {
    localStorage.clear("token");
    resetVars();
    redirect("/pages/login");
  }
}

/**
 * Generates a preview card for tasks.
 * @param {object} options - The options for creating the task card.
 * @param {string} options.id - The unique identifier for the task.
 * @param {string} options.title - The title of the task.
 * @param {string} options.priority - The priority level of the task.
 * @param {string} options.description - The description of the task.
 * @param {object} options.time_box - The time box for the task containing 'to' property.
 * @returns {HTMLElement} - The HTML element representing the task preview card.
 */
function createPrevTaskCard({ id, title, priority, description, time_box }) {
  // fetch due times for each task
  const [dueHour, dueMinute, duePeriod] = time_box.to;

  const articleElement = document.createElement("article");
  articleElement.classList.add("task", "task--preview");
  articleElement.setAttribute("key", `task-P${id}X`);

  // Child => create prev icon
  const icon = document.createElement("i");
  icon.setAttribute("alt", "task icon");
  icon.classList.add("task__icon", "fa-solid", "fa-school");

  // inner info Child < Parent
  const innerDivElement = document.createElement("div");
  innerDivElement.classList.add("task__info");

  // title
  const innerDivTitle = document.createElement("p");
  innerDivTitle.textContent = `Task: "${title}"`;
  innerDivTitle.classList.add("task__title");

  // description
  const innerDivDescription = document.createElement("p");
  innerDivDescription.classList.add("task__description");
  innerDivDescription.textContent = description;

  // description text < child
  const descriptionText = document.createElement("span");
  descriptionText.classList.add("task__description__text");
  descriptionText.innerText = "Description: ";

  // prepend description text
  innerDivDescription.prepend(descriptionText);

  // Create wrapper for button list < Child < Parent
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("task__button-container");

  // CTA button Modify #1 < Child < Parent
  const modifyButton = document.createElement("button");
  modifyButton.classList.add("button__cta");
  modifyButton.textContent = "Modify task";

  modifyButton.addEventListener("click", () => {
    openModifyTask({ id, title, priority, description, time_box });
  });

  // Modify icon for button Child
  const modifyIcon = document.createElement("i");
  modifyIcon.classList.add("fa-solid", "fa-pen-to-square");

  // append modify icon
  modifyButton.append(modifyIcon);

  // ======

  // CTA button Delete #2 < Child < Parent
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("button__cta");
  deleteButton.textContent = "Delete task";

  deleteButton.addEventListener("click", (e) => handleDeleteTask(e, id));

  // Delete icon for button Child
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash");

  // append delete icon
  deleteButton.append(deleteIcon);

  // ======

  // CTA button Mark As done #3 < Child < Parent
  const doneButton = document.createElement("button");
  doneButton.classList.add("button__cta");
  doneButton.textContent = "Mark as done";

  doneButton.addEventListener("click", (e) => handleMDone(e, id));

  // Check icon for button Child
  const doneIcon = document.createElement("i");
  doneIcon.classList.add("fa-solid", "fa-circle-check");

  // append check icon
  doneButton.append(doneIcon);

  // append buttons to the wrapper div
  buttonContainer.append(modifyButton, deleteButton, doneButton);

  // ===

  // Create Due paragraph < Child < Parent
  const dueParagraph = document.createElement("p");
  dueParagraph.classList.add("task__due");

  // if passed deadline, apply underline
  if (isTodoPassedDeadline("task", time_box.to)) {
    dueParagraph.classList.add("task__due--finished");
  }

  // Create Inner Span for Due text
  const dueTextSpan = document.createElement("span");
  dueTextSpan.classList.add("task__due__text");
  dueTextSpan.textContent = "Due: ";
  dueParagraph.textContent = `${dueHour} : ${dueMinute} ${duePeriod}`;

  // prepend span text
  dueParagraph.prepend(dueTextSpan);

  // append buttons to the wrapper

  // append inner div
  innerDivElement.append(
    innerDivTitle,
    innerDivDescription,
    buttonContainer,
    dueParagraph
  );

  // X Close icon < Child
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");

  closeIcon.addEventListener("click", () => handleCloseTaskCard(id));
  // append to otter article
  articleElement.append(icon, innerDivElement, closeIcon);

  return articleElement;
}

/**
 * Generates a starter card when no exams or assignments are present or available.
 * @param {HTMLElement} examSection - The HTML element representing the section where the starter card will be appended.
 * @returns {void} - The function does not return a value.
 */
function createStarterExamCard(examSection) {
  // create parent article
  const articleElement = document.createElement("article");
  articleElement.classList.add("exam", "exam--starter");

  // Child => create starter icon
  const icon = document.createElement("i");
  icon.setAttribute("alt", "exam icon");
  icon.classList.add("exam__icon", "fa-solid", "fa-book");

  // inner info Child < Parent
  const innerDivElement = document.createElement("div");
  innerDivElement.classList.add("exam__info");

  // title < Child - inner div
  const innerDivTitle = document.createElement("p");
  innerDivTitle.textContent = "Upcoming exam!";
  innerDivTitle.classList.add("exam__title");

  // description < Child - inner div
  const innerDivDescription = document.createElement("p");
  innerDivDescription.classList.add("exam__description");
  innerDivDescription.textContent =
    "you currently do don’t have any upcoming exams at the moment";

  // CTA button < Child - inner div < parent
  const ctaButton = document.createElement("button");
  ctaButton.classList.add("button__cta");
  ctaButton.textContent = "Add an exam data";
  ctaButton.addEventListener("click", () => openAddExam());

  // plus icon < Child - CTA button
  const plusIcon = document.createElement("i");
  plusIcon.classList.add("fa-light", "fa-plus");

  // append plus icon
  ctaButton.append(plusIcon);

  // append inner div
  innerDivElement.append(innerDivTitle, innerDivDescription, ctaButton);

  // append to otter article
  articleElement.append(icon, innerDivElement);

  // apped to section
  examSection.append(articleElement);
}

/**
 * Generates a preview card for exams.
 * @param {object} options - The options for creating the exam card.
 * @param {string} options.id - The unique identifier for the exam.
 * @param {string} options.name - The name of the course for the exam.
 * @param {string} options.type - The type of the exam.
 * @param {string} options.result - The result of the exam.
 * @param {object} options.due - The due date and time of the exam.
 * @param {array} options.due.time - An array representing the time [hour, minute, period].
 * @param {object} options.due.date - An object representing the date {day, month, year}.
 * @returns {HTMLElement} - The HTML element representing the exam preview card.
 */
function createPrevExamCard({ id, name, type, result, due }) {
  // fetch due times for each exam
  const { time, date } = due;
  const [dueHour, dueMinute, duePeriod] = time;
  const { day, month, year } = date;

  const dueDate = new Date(
    `${month}/${day}/${year} ${dueHour}:${dueMinute} ${duePeriod}`
  );

  const articleElement = document.createElement("article");
  articleElement.classList.add("exam", "exam--preview");
  articleElement.setAttribute("key", `exam-P${id}X`);

  // Child => create prev icon
  const icon = document.createElement("i");
  icon.setAttribute("alt", "exam icon");
  icon.classList.add("exam__icon", "fa-solid", "fa-book");

  // inner info Child < Parent
  const innerDivElement = document.createElement("div");
  innerDivElement.classList.add("exam__info");

  // exam title < Parent < Child
  const innerDivTitle = document.createElement("p");
  innerDivTitle.textContent = "incoming: ";

  innerDivTitle.classList.add("exam__title");

  const titleTypeSpan = document.createElement("span");
  titleTypeSpan.classList.add("exam__title__type");
  titleTypeSpan.textContent = `"${type}"`;

  // append exam type to the title <p>
  innerDivTitle.append(titleTypeSpan);

  // divider #1 < Child
  const divider1El = document.createElement("div");

  // exam description < Parent < Child
  const innerDivExamName = document.createElement("p");
  innerDivExamName.classList.add("exam__name");
  innerDivExamName.textContent = "Course: ";

  // course name < Child
  const courseNameSpan = document.createElement("span");
  courseNameSpan.classList.add("exam__name--bold");
  courseNameSpan.textContent = name;

  // Append span to course name <p>
  innerDivExamName.append(courseNameSpan);

  // divider #2 < Child
  const divider2El = document.createElement("div");

  // Create Due paragraph < Child < Parent
  const dueParagraph = document.createElement("p");
  dueParagraph.classList.add("exam__due");

  // Create Inner Span for Due text
  const dueTextSpan = document.createElement("span");
  dueTextSpan.classList.add("exam__due__text");
  dueTextSpan.textContent = "Due: ";

  const formattedDueDate = formatExamDueDate(dueDate);
  dueParagraph.textContent = `${formattedDueDate} `;

  // prepend span text
  dueParagraph.prepend(dueTextSpan);

  // append inner div
  innerDivElement.append(
    innerDivTitle,
    divider1El,
    innerDivExamName,
    divider2El,
    dueParagraph
  );

  // X Close icon < Child
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");
  closeIcon.addEventListener("click", (e) => handleCloseExamCard(e, id));

  // append to outer article
  articleElement.append(icon, innerDivElement, closeIcon);
  articleElement.addEventListener("click", (e) => {
    e.preventDefault();
    openModifyExam({ id, name, type, result, due });
  });

  return articleElement;
}

/**
 * Generates the preview card when the due date is passed and no guesses received for the exams.
 *
 * @param {Object} params - The parameters for creating the preview card.
 * @param {string} params.id - The identifier of the exam.
 * @param {string} params.name - The name of the course.
 * @param {string} params.type - The type of the exam.
 * @param {Object} params.due - The due date and time for the exam.
 * @param {Array} params.due.time - The time of the exam [hour, minute, period].
 * @param {Object} params.due.date - The date of the exam {day, month, year}.
 * @returns {HTMLDivElement} - The generated preview card as an HTMLDivElement.
 */
function createQuessPrevExamCard({ id, name, type, due, result }) {
  // fetch due times for each exam
  const { time, date } = due;
  const [dueHour, dueMinute, duePeriod] = time;
  const { day, month, year } = date;

  const dueDate = new Date(
    `${month}/${day}/${year} ${dueHour}:${dueMinute} ${duePeriod}`
  );

  const articleElement = document.createElement("article");
  articleElement.classList.add("exam", "exam--finished");
  articleElement.setAttribute("key", `exam-P${id}X`);

  // exam container Parent < child
  const container = document.createElement("div");
  container.classList.add("exam__container");
  const containerHeader = document.createElement("div");
  containerHeader.classList.add("exam__header");

  // X Close icon < Child
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");
  closeIcon.addEventListener("click", (e) => handleCloseExamCard(e, id));

  // Child => create card icon
  const icon = document.createElement("i");
  icon.setAttribute("alt", "exam icon");
  icon.classList.add("exam__icon", "fa-solid", "fa-book");

  // inner info Child < Parent
  const innerDivElement = document.createElement("div");
  innerDivElement.classList.add("exam__info");

  // exam title < Parent < Child
  const innerDivTitle = document.createElement("p");
  innerDivTitle.classList.add("exam__title");
  innerDivTitle.textContent = "completed: ";

  const titleTypeSpan = document.createElement("span");
  titleTypeSpan.classList.add("exam__title__type");
  titleTypeSpan.textContent = `"${type}"!`;

  // append exam type to the title <p>
  innerDivTitle.append(titleTypeSpan);

  // divider #1 < Child
  const divider1El = document.createElement("div");

  // exam description < Parent < Child
  const innerDivExamName = document.createElement("p");
  innerDivExamName.classList.add("exam__name");
  innerDivExamName.textContent = "Course: ";

  // course name < Child
  const courseNameSpan = document.createElement("span");
  courseNameSpan.classList.add("exam__name--bold");
  courseNameSpan.textContent = name;

  // Append span to course name <p>
  innerDivExamName.append(courseNameSpan);

  // divider #2 < Child
  const divider2El = document.createElement("div");

  // Create Due paragraph < Child < Parent
  const dueParagraph = document.createElement("p");
  dueParagraph.classList.add("exam__due");
  dueParagraph.classList.add("exam__due--finished");

  // Create Inner Span for Due text
  const dueTextSpan = document.createElement("span");
  dueTextSpan.classList.add("exam__due__text");
  dueTextSpan.textContent = "Due: ";

  const formattedDueDate = formatExamDueDate(dueDate);
  dueParagraph.textContent = `${formattedDueDate} `;

  // prepend span text
  dueParagraph.prepend(dueTextSpan);

  // append inner div
  innerDivElement.append(
    icon,
    innerDivTitle,
    divider1El,
    innerDivExamName,
    divider2El,
    dueParagraph
  );

  // Append to the container header
  containerHeader.appendChild(innerDivElement);

  // Guess wrappper div
  const guessWrapper = document.createElement("div");
  guessWrapper.classList.add("exam__guess-wrapper");

  const guessText = document.createElement("p");
  guessText.classList.add("exam__guess-text");
  guessText.textContent = "How did you do? (guess)";

  // guess button wrapper Child < Parent
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("exam__guess-button-wrapper");

  // button `BAD`
  const badButton = document.createElement("button");
  badButton.classList.add("exam__guess-button");
  badButton.textContent = "BAD";
  badButton.addEventListener("click", (e) => handeBadButton(e, id, result));
  // button `OK`
  const okButton = document.createElement("button");
  okButton.classList.add("exam__guess-button");
  okButton.textContent = "OK";
  okButton.addEventListener("click", (e) => handeOkButton(e, id, result));

  // button `WELL`
  const wellButton = document.createElement("button");
  wellButton.classList.add("exam__guess-button");
  wellButton.textContent = "WELL";
  wellButton.addEventListener("click", (e) => handeWellButton(e, id, result));

  // Append buttons to the button wrapper
  buttonWrapper.append(badButton, okButton, wellButton);

  // Append both texts and button wrapper to the guess wrapper
  guessWrapper.append(guessText, buttonWrapper);

  // Append everthing ti the container
  container.append(containerHeader, guessWrapper);

  // append to outer article
  articleElement.append(container, closeIcon);

  return articleElement;
}

/**
 * Places task information in the designated article element based on the provided task array.
 *
 * @function placeTasks
 * @param {Object[]} taksArray - An array containing task objects with details.
 * @returns {void} Returns undefined.
 */
function placeTasks(taksArray) {
  const taskSection = document.querySelector(".todos > .todos__tasks");

  // Remove all child elements
  taskSection.replaceChildren();
  const filteredTaskVis = taksArray?.filter(({ visibility }) => visibility);

  if (filteredTaskVis?.length === 0) {
    const seeAllButton = document.querySelector(
      ".todos__tasks > .button__see-all"
    );
    const addTaskButton = document.querySelector(
      ".todos__tasks > .button__add-todo"
    );
    // attempt to remove see all because there is no tasks
    seeAllButton?.remove();
    addTaskButton?.remove();

    createStarterTaskCard(taskSection);
  } else {
    const seeAllButton = document.querySelector(
      ".todos__tasks > .button__see-all"
    );
    // attempt to add see all button if it doesn't exist
    if (!seeAllButton) {
      // create the button
      const seeAllButton = document.createElement("button");
      seeAllButton.classList.add("button__see-all");
      seeAllButton.textContent = "See all";
      seeAllButton.addEventListener("click", () => openSATasks(taksArray));
      taskSection.append(seeAllButton);
    }

    // Filter by whether it's visible, sorting it by time (by todays date) then looping to create card fron each
    taksArray
      .filter((task) => task.visibility)
      // sorting is soly on the (time). there isn't any date involved, date is assessed by todays date
      .sort((a, b) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const dA = new Date(year, month, day, ...timeTo24(a.time_box.to));
        const dB = new Date(year, month, day, ...timeTo24(b.time_box.to));
        return dA - dB;
      })
      .forEach((task) => {
        const taskCard = createPrevTaskCard(task);

        // apped to section
        taskSection.append(taskCard);
      });
    const addTaskButton = document.querySelector(
      ".todos__tasks > .button__add-todo"
    );
    if (!addTaskButton) {
      // Create the button - Parent
      const addTaskButton = document.createElement("button");

      // Create the icon < Child
      const plusIcon = document.createElement("i");
      plusIcon.classList.add("fa-solid", "fa-plus");

      addTaskButton.classList.add("button--rounded", "button__add-todo");
      // Append plus icon
      addTaskButton.append(plusIcon);
      addTaskButton.addEventListener("click", () => openAddTask());

      // Append to task section
      taskSection.append(addTaskButton);
    }
  }
}

/**
 * Places exam information in the designated article element based on the provided exams array.
 *
 * @function placeExams
 * @param {Object[]} examsArray - An array containing exam objects with details.
 * @returns {void} Returns undefined.
 */
function placeExams(examsArray) {
  const examSection = document.querySelector(".todos > .todos__exams");

  // Remove all child elements
  examSection.replaceChildren();
  const filteredExamVis = examsArray?.filter(({ visibility }) => visibility);
  if (filteredExamVis?.length === 0) {
    const addExamButton = document.querySelector(
      ".todos__exams > .button__add-todo"
    );
    const seeAllButton = document.querySelector(
      ".todos__exams > .button__see-all"
    );
    // attempt to remove see all because there is no exams
    seeAllButton?.remove();
    addExamButton?.remove();
    createStarterExamCard(examSection);
  } else {
    const seeAllButton = document.querySelector(
      ".todos__exams > .button__see-all"
    );
    // attempt to add see all button if it doesn't exist
    if (!seeAllButton) {
      const seeAllButton = document.createElement("button");
      seeAllButton.classList.add("button__see-all");
      seeAllButton.textContent = "See all";
      seeAllButton.addEventListener("click", () => openSAExams(examsArray));
      examSection.append(seeAllButton);
    }

    // Filter by whether it's visible, sorting it by date/time then looping to create card fron each
    filteredExamVis
      .sort((a, b) => {
        // Months are string from index-0 in Date Object
        const dueDateA = new Date(
          a.due.date.year,
          a.due.date.month - 1,
          a.due.date.day,
          // Destruct the converted time
          ...timeTo24(a.due.time)
        );
        const dueDateB = new Date(
          b.due.date.year,
          b.due.date.month - 1,
          b.due.date.day,
          // Destruct the converted time
          ...timeTo24(b.due.time)
        );

        return dueDateA - dueDateB;
      })
      .forEach((exam) => {
        const { due, result } = exam;
        const isPassed = isTodoPassedDeadline("exam", due.time, due.date);
        if (isPassed && (!result || result?.guess === "-")) {
          const examCard = createQuessPrevExamCard(exam);
          examSection.append(examCard);
        } else {
          const examCard = createPrevExamCard(exam);
          examSection.append(examCard);
        }
      });
    const addExamButton = document.querySelector(
      ".todos__exams > .button__add-todo"
    );
    if (!addExamButton) {
      // Create the button - Parent
      const addExamButton = document.createElement("button");

      // Create the icon < Child
      const plusIcon = document.createElement("i");
      plusIcon.classList.add("fa-solid", "fa-plus");

      addExamButton.classList.add("button--rounded", "button__add-todo");
      // Append plus icon
      addExamButton.append(plusIcon);
      addExamButton.addEventListener("click", () => openAddExam());

      // Append to task section
      examSection.append(addExamButton);
    }
  }
}

/**
 * Fetches user data based on the provided user ID and populates the main section with tasks and exams.
 *
 * @async
 * @function fetchUserData
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<void>} A promise that resolves when the user data is fetched and processed.
 */
export async function fetchUserData(token) {
  try {
    const response = await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/api/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    });
    if (response.ok) {
      const fetchedData = await response.json();

      // placing users data
      placeTasks(fetchedData.tasks);
      placeExams(fetchedData.exams);

      // store inital arrays in the variables
      initTempTaskArr(fetchedData.tasks);
      initTempExamArr(fetchedData.exams);
    } else {
      console.error("Failed to fetch data for the user");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
