import { createModal } from "../../helpers/manageModal.js";
import { handleCloseModal } from "../../helpers/manageModal.js";
import { onBlurHour, onBlurMinute } from "../../helpers/inputs.js";
import { fetchUserData } from "../todos.js";
/**
 * Opens the modal for adding a task.
 * @function openAddTask
 * @returns {void}
 */
export function openAddTask() {
  const [modal, modalBox] = createModal({
    modalClass: "add-task",
    modalIconClass: ["fa-solid", "fa-list-check"],
    modalTitle: "Add a task",
    modalDescription:
      "Create your reading task precisely and see that in your main dashboard",
  });

  modal.setAttribute("open", "");

  // Form content
  const form = document.createElement("form");
  form.setAttribute("method", "dialog");
  form.classList.add("add-task__form");

  const nameWrapper = document.createElement("div");
  nameWrapper.classList.add("add-task__name-wrapper");

  const nameText = document.createElement("label");
  nameText.classList.add("add-task__name-text");
  nameText.textContent = "Name *";

  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "name");
  nameInput.classList.add("input");
  nameInput.setAttribute("placeholder", "read calculus");

  nameWrapper.append(nameText, nameInput);

  // Priority wrapper
  const priorityWrapper = document.createElement("div");
  priorityWrapper.classList.add("add-task__priority-wrapper");

  const priorityText = document.createElement("label");
  priorityText.classList.add("add-task__priority-text");
  priorityText.textContent = "Priority *";

  const prioritySelect = document.createElement("select");
  prioritySelect.setAttribute("name", "priority");
  prioritySelect.classList.add("add-task__priority");

  const priorityOption1 = document.createElement("option");
  priorityOption1.setAttribute("value", "1");
  priorityOption1.setAttribute("selected", "");
  priorityOption1.textContent = "Low";

  const priorityOption2 = document.createElement("option");
  priorityOption2.setAttribute("value", "2");
  priorityOption2.textContent = "Medium";

  const priorityOption3 = document.createElement("option");
  priorityOption3.setAttribute("value", "3");
  priorityOption3.textContent = "High";

  // Append options to priority select
  prioritySelect.append(priorityOption1, priorityOption2, priorityOption3);

  // Append priority select and text to its wrappper
  priorityWrapper.append(priorityText, prioritySelect);

  // Description wrapper
  const descriptionWrapper = document.createElement("div");
  descriptionWrapper.classList.add("add-task__description-wrapper");

  const descriptionText = document.createElement("label");
  descriptionText.classList.add("add-task__description-text");
  descriptionText.textContent = "Description *";

  const descriptionTextarea = document.createElement("textarea");
  descriptionTextarea.setAttribute("type", "text");
  descriptionTextarea.setAttribute("name", "description");
  descriptionTextarea.classList.add("add-task__description-textarea");
  descriptionTextarea.setAttribute("maxlength", "100");
  descriptionTextarea.setAttribute(
    "placeholder",
    "Type your description here..."
  );
  descriptionTextarea.setAttribute("rows", "5");

  // Append description and text to its wrappper
  descriptionWrapper.append(descriptionText, descriptionTextarea);

  // Due wrapper
  const dueWrapper = document.createElement("div");
  dueWrapper.classList.add("add-task__due-wrapper");

  // From wrapper
  const fromWrapper = document.createElement("div");
  fromWrapper.classList.add("add-task__from");

  const fromText = document.createElement("label");
  fromText.classList.add("add-task__from-text");
  fromText.textContent = "From *";

  const fromTime = document.createElement("div");
  fromTime.classList.add("add-task__from__time");

  // From hour wrapper
  const fromHourWrapper = document.createElement("div");
  fromHourWrapper.classList.add("add-task__from__hour-wrapper");

  const fromHourInput = document.createElement("input");
  fromHourInput.setAttribute("type", "number");
  fromHourInput.setAttribute("name", "from_hour");
  fromHourInput.classList.add("input");
  fromHourInput.setAttribute("placeholder", "hour");
  fromHourInput.setAttribute("min", 0);
  fromHourInput.setAttribute("max", 23);
  fromHourInput.addEventListener("blur", (e) => onBlurHour(e));

  const fromMinuteInput = document.createElement("input");
  fromMinuteInput.setAttribute("type", "number");
  fromMinuteInput.setAttribute("name", "from_minute");
  fromMinuteInput.classList.add("input");
  fromMinuteInput.setAttribute("placeholder", "minute");
  fromMinuteInput.setAttribute("min", 0);
  fromMinuteInput.setAttribute("max", 59);
  fromMinuteInput.addEventListener("blur", (e) => onBlurMinute(e));

  fromHourWrapper.append(fromHourInput, fromMinuteInput);

  // From period select
  const fromPeriodSelect = document.createElement("select");
  fromPeriodSelect.setAttribute("name", "from-period");

  const fromAMOption = document.createElement("option");
  fromAMOption.setAttribute("value", "AM");
  fromAMOption.textContent = "AM";

  const fromPMOption = document.createElement("option");
  fromPMOption.setAttribute("value", "PM");
  fromPMOption.textContent = "PM";

  // Append AM PM option to the `from` period select
  fromPeriodSelect.append(fromAMOption, fromPMOption);

  // Append both `from` hour inputs and its priod to outter wrapper
  fromTime.append(fromHourWrapper, fromPeriodSelect);

  // Add time and text to `form` elemet
  fromWrapper.append(fromText, fromTime);

  // To wrapper
  const toWrapper = document.createElement("div");
  toWrapper.classList.add("add-task__to");

  const toText = document.createElement("label");
  toText.classList.add("add-task__from-text");
  toText.textContent = "To *";

  const toTime = document.createElement("div");
  toTime.classList.add("add-task__to__time");

  // To hour wrapper
  const toHourWrapper = document.createElement("div");
  toHourWrapper.classList.add("add-task__to__hour-wrapper");

  const toHourInput = document.createElement("input");
  toHourInput.setAttribute("type", "number");
  toHourInput.setAttribute("name", "to_hour");
  toHourInput.classList.add("input");
  toHourInput.setAttribute("placeholder", "hour");
  toHourInput.setAttribute("min", 0);
  toHourInput.setAttribute("max", 23);
  toHourInput.addEventListener("blur", (e) => onBlurHour(e));

  const toMinuteInput = document.createElement("input");
  toMinuteInput.setAttribute("type", "number");
  toMinuteInput.setAttribute("name", "to_minute");
  toMinuteInput.classList.add("input");
  toMinuteInput.setAttribute("placeholder", "minute");
  toMinuteInput.setAttribute("min", 0);
  toMinuteInput.setAttribute("max", 59);
  toMinuteInput.addEventListener("blur", (e) => onBlurMinute(e));

  // Append inputs to the `to` wrapper
  toHourWrapper.append(toHourInput, toMinuteInput);

  // To period select
  const toPeriodSelect = document.createElement("select");
  toPeriodSelect.setAttribute("name", "to__period");
  toPeriodSelect.classList.add("to-period");

  const toAMOption = document.createElement("option");
  toAMOption.setAttribute("value", "AM");
  toAMOption.textContent = "AM";

  const toPMOption = document.createElement("option");
  toPMOption.setAttribute("value", "PM");
  toPMOption.textContent = "PM";

  // Append AM PM option to the `to` period select
  toPeriodSelect.append(toAMOption, toPMOption);

  // Append input wrapper and select to the outter `to` div wrapper
  toTime.append(toHourWrapper, toPeriodSelect);

  toWrapper.append(toText, toTime);

  // Append 'From' and 'To' sections to due wrapper
  dueWrapper.append(fromWrapper, toWrapper);

  // Append `due` wrapper to the form
  form.append(nameWrapper, priorityWrapper, descriptionWrapper, dueWrapper);

  // Button wrapper
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("add-task__button-wrapper");

  // Cancel button
  const cancelButton = document.createElement("button");
  cancelButton.classList.add("button--secondary");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (e) => handleCloseModal(e));

  // Add button
  const addButton = document.createElement("button");
  addButton.classList.add("button--primary");
  addButton.textContent = "Add";
  addButton.addEventListener("click", (e) => handleAddTask(e));

  // Append both buttons
  buttonWrapper.append(cancelButton, addButton);

  // Append button wrapper to the form
  form.appendChild(buttonWrapper);

  // Append all the divs to the modal box
  modalBox.appendChild(form);

  // Append modal box to modal overlay
  modal.appendChild(modalBox);

  // Append modal overlay to the document body
  document.body.appendChild(modal);
}

/**
 * Opens a modal for modifying a task with the provided details.
 *
 * @function openModifyTask
 * @param {Object} taskDetails - The details of the task to be modified.
 * @param {string} taskDetails.title - The title of the task.
 * @param {string} taskDetails.priority - The priority of the task.
 * @param {string} taskDetails.description - The description of the task.
 * @param {[number|string]} taskDetails.time_box - The time box details of the task.
 * @returns {void} Returns undefined.
 */
export function openModifyTask({ id, title, priority, description, time_box }) {
  const [modal, modalBox] = createModal({
    modalClass: "modify-task",
    modalIconClass: ["fa-solid", "fa-list-check"],
    modalTitle: "Modify a task",
    modalDescription:
      "Modify your reading task precisely and see that in your main dashboard",
  });

  modal.setAttribute("open", "");

  // Form content
  const form = document.createElement("form");
  form.setAttribute("method", "dialog");
  form.classList.add("modify-task__form");

  const nameWrapper = document.createElement("div");
  nameWrapper.classList.add("modify-task__name-wrapper");

  const nameText = document.createElement("label");
  nameText.classList.add("modify-task__name-text");
  nameText.textContent = "Name *";

  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "name");
  nameInput.classList.add("input");
  nameInput.value = title;
  nameInput.setAttribute("placeholder", "read calculus");

  nameWrapper.append(nameText, nameInput);

  // Priority wrapper
  const priorityWrapper = document.createElement("div");
  priorityWrapper.classList.add("modify-task__priority-wrapper");

  const priorityText = document.createElement("label");
  priorityText.classList.add("modify-task__priority-text");
  priorityText.textContent = "Priority *";

  const prioritySelect = document.createElement("select");
  prioritySelect.setAttribute("name", "priority");
  prioritySelect.classList.add("modify-task__priority");
  prioritySelect.value = priority;

  const priorityOption1 = document.createElement("option");
  priorityOption1.setAttribute("value", "1");
  if (priority === 1) {
    priorityOption1.setAttribute("selected", "");
  }
  priorityOption1.textContent = "Low";

  const priorityOption2 = document.createElement("option");
  priorityOption2.setAttribute("value", "2");
  if (priority === 2) {
    priorityOption2.setAttribute("selected", "");
  }
  priorityOption2.textContent = "Medium";

  const priorityOption3 = document.createElement("option");
  priorityOption3.setAttribute("value", "3");
  if (priority === 3) {
    priorityOption3.setAttribute("selected", "");
  }
  priorityOption3.textContent = "High";

  // Append options to priority select
  prioritySelect.append(priorityOption1, priorityOption2, priorityOption3);

  // Append priority select and text to its wrappper
  priorityWrapper.append(priorityText, prioritySelect);

  // Description wrapper
  const descriptionWrapper = document.createElement("div");
  descriptionWrapper.classList.add("modify-task__description-wrapper");

  const descriptionText = document.createElement("label");
  descriptionText.classList.add("modify-task__description-text");
  descriptionText.textContent = "Description *";

  const descriptionTextarea = document.createElement("textarea");
  descriptionTextarea.setAttribute("type", "text");
  descriptionTextarea.setAttribute("name", "description");
  descriptionTextarea.classList.add("modify-task__description-textarea");
  descriptionTextarea.value = description;
  descriptionTextarea.setAttribute("maxlength", "100");
  descriptionTextarea.setAttribute(
    "placeholder",
    "Type your description here..."
  );
  descriptionTextarea.setAttribute("rows", "5");

  // Append description and text to its wrappper
  descriptionWrapper.append(descriptionText, descriptionTextarea);

  // Due wrapper
  const dueWrapper = document.createElement("div");
  dueWrapper.classList.add("modify-task__due-wrapper");

  // From wrapper
  const fromWrapper = document.createElement("div");
  fromWrapper.classList.add("modify-task__from");

  const fromText = document.createElement("label");
  fromText.classList.add("modify-task__from-text");
  fromText.textContent = "From *";

  const fromTime = document.createElement("div");
  fromTime.classList.add("modify-task__from__time");

  // From hour wrapper
  const fromHourWrapper = document.createElement("div");
  fromHourWrapper.classList.add("modify-task__from__hour-wrapper");

  const fromHourInput = document.createElement("input");
  fromHourInput.setAttribute("type", "number");
  fromHourInput.setAttribute("name", "from_hour");
  fromHourInput.classList.add("input");
  fromHourInput.setAttribute("placeholder", "hour");
  fromHourInput.setAttribute("min", 0);
  fromHourInput.setAttribute("max", 23);
  fromHourInput.value = time_box.start[0];
  fromHourInput.addEventListener("blur", (e) => onBlurHour(e));

  const fromMinuteInput = document.createElement("input");
  fromMinuteInput.setAttribute("type", "number");
  fromMinuteInput.setAttribute("name", "from_minute");
  fromMinuteInput.classList.add("input");
  fromMinuteInput.setAttribute("placeholder", "minute");
  fromMinuteInput.setAttribute("min", 0);
  fromMinuteInput.setAttribute("max", 59);
  fromMinuteInput.value = time_box.start[1];
  fromMinuteInput.addEventListener("blur", (e) => onBlurMinute(e));

  fromHourWrapper.append(fromHourInput, fromMinuteInput);

  // From period select
  const fromPeriodSelect = document.createElement("select");
  fromPeriodSelect.setAttribute("name", "from-period");
  fromPeriodSelect.value = time_box.start[2];

  const fromAMOption = document.createElement("option");
  fromAMOption.setAttribute("value", "AM");
  fromAMOption.textContent = "AM";
  if (time_box.start[2] === "AM") {
    fromAMOption.setAttribute("selected", "");
  }
  const fromPMOption = document.createElement("option");
  fromPMOption.setAttribute("value", "PM");
  fromPMOption.textContent = "PM";
  if (time_box.start[2] === "PM") {
    fromPMOption.setAttribute("selected", "");
  }

  // Append AM PM option to the `from` period select
  fromPeriodSelect.append(fromAMOption, fromPMOption);

  // Append both `from` hour inputs and its priod to outter wrapper
  fromTime.append(fromHourWrapper, fromPeriodSelect);

  // Add time and text to `form` elemet
  fromWrapper.append(fromText, fromTime);

  // To wrapper
  const toWrapper = document.createElement("div");
  toWrapper.classList.add("modify-task__to");

  const toText = document.createElement("label");
  toText.classList.add("modify-task__from-text");
  toText.textContent = "To *";

  const toTime = document.createElement("div");
  toTime.classList.add("modify-task__to__time");

  // To hour wrapper
  const toHourWrapper = document.createElement("div");
  toHourWrapper.classList.add("modify-task__to__hour-wrapper");

  const toHourInput = document.createElement("input");
  toHourInput.setAttribute("type", "number");
  toHourInput.setAttribute("name", "to_hour");
  toHourInput.classList.add("input");
  toHourInput.setAttribute("placeholder", "hour");
  toHourInput.setAttribute("min", 0);
  toHourInput.setAttribute("max", 23);
  toHourInput.value = time_box.to[0];
  toHourInput.addEventListener("blur", (e) => onBlurHour(e));

  const toMinuteInput = document.createElement("input");
  toMinuteInput.setAttribute("type", "number");
  toMinuteInput.setAttribute("name", "to_minute");
  toMinuteInput.classList.add("input");
  toMinuteInput.setAttribute("placeholder", "minute");
  toMinuteInput.setAttribute("min", 0);
  toMinuteInput.setAttribute("max", 59);
  toMinuteInput.value = time_box.to[1];
  toMinuteInput.addEventListener("blur", (e) => onBlurMinute(e));

  // Append inputs to the `to` wrapper
  toHourWrapper.append(toHourInput, toMinuteInput);

  // To period select
  const toPeriodSelect = document.createElement("select");
  toPeriodSelect.setAttribute("name", "to__period");
  toPeriodSelect.classList.add("modify-task__to-period");
  toPeriodSelect.value = time_box.to[2];

  const toAMOption = document.createElement("option");
  toAMOption.setAttribute("value", "AM");
  toAMOption.textContent = "AM";
  if (time_box.to[2] === "AM") {
    toAMOption.setAttribute("selected", "");
  }

  const toPMOption = document.createElement("option");
  toPMOption.setAttribute("value", "PM");
  toPMOption.textContent = "PM";
  if (time_box.to[2] === "PM") {
    toPMOption.setAttribute("selected", "");
  }

  // Append AM PM option to the `to` period select
  toPeriodSelect.append(toAMOption, toPMOption);

  // Append input wrapper and select to the outter `to` div wrapper
  toTime.append(toHourWrapper, toPeriodSelect);

  toWrapper.append(toText, toTime);

  // Append 'From' and 'To' sections to due wrapper
  dueWrapper.append(fromWrapper, toWrapper);

  // Append `due` wrapper to the form
  form.append(nameWrapper, priorityWrapper, descriptionWrapper, dueWrapper);

  // Button wrapper
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("modify-task__button-wrapper");

  // Cancel button
  const cancelButton = document.createElement("button");
  cancelButton.classList.add("button--secondary");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (e) => handleCloseModal(e));

  // Add button
  const addButton = document.createElement("button");
  addButton.classList.add("button--primary");
  addButton.textContent = "Modify";

  addButton.addEventListener("click", (e) => handleModifyTask(e, id));

  // Append both buttons
  buttonWrapper.append(cancelButton, addButton);

  // Append button wrapper to the form
  form.appendChild(buttonWrapper);

  // Append all the divs to the modal box
  modalBox.appendChild(form);

  // Append modal box to modal overlay
  modal.appendChild(modalBox);

  // Append modal overlay to the document body
  document.body.appendChild(modal);
}

/**
 * PUT REQUEST: Handles modification of a task based on the form input values.
 *
 * @function handleModifyTask
 * @returns {void} Returns undefined.
 */
async function handleModifyTask(e, id) {
  const formElements = document.querySelector(".modify-task__form").elements;

  // Extract only the inputs wanted to be sent and check if they're not empty
  const isAnyFieldEmpty = Array.from(formElements)
    .slice(0, 9)
    .some((element) => element.value === "");

  if (isAnyFieldEmpty) {
    // Filter the empty fields and place invalid class to them
    const emptyFields = Array.from(formElements)
      .slice(0, 9)
      .filter((element) => element.value === "");
    emptyFields.forEach((element) => {
      element.classList.add("input--invalid");
    });

    return alert("Please fill all the inputs");
  }

  // Creating object for PUT request
  const requestObj = {
    task_id: id,
    title: formElements[0].value,
    priority: formElements[1].value,
    description: formElements[2].value,
    time_box: {
      // start: [Hour, Minute, Period]
      start: [
        parseInt(formElements[3].value),
        parseInt(formElements[4].value),
        formElements[5].value,
      ],
      // to: [Hour, Minute, Period]
      to: [
        parseInt(formElements[6].value),
        parseInt(formElements[7].value),
        formElements[8].value,
      ],
    },
  };

  const token = localStorage.getItem("token");
  try {
    await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/api/todos/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(requestObj),
    });

    handleCloseModal(e);
    alert("task has been successfully modified");

    await fetchUserData(token.split(" ")[1]);
  } catch (err) {
    localStorage.clear("token");
    resetVars();
    redirect("/pages/login");
    return console.error("Error while modifing the task");
  }
}

/**
 * POST REQUEST: Handles the addition of a task based on the form input values.
 *
 * @function handleAddTask
 * @returns {void} Returns undefined.
 */
async function handleAddTask(e) {
  e.preventDefault();
  const formElements = document.querySelector(".add-task__form").elements;

  // Extract only the inputs wanted to be sent and check if they're not empty
  const isAnyFieldEmpty = Array.from(formElements)
    .slice(0, 9)
    .some((element) => element.value === "");

  if (isAnyFieldEmpty) {
    // Filter the empty fields and place invalid class to them
    const emptyFields = Array.from(formElements)
      .slice(0, 9)
      .filter((element) => element.value === "");
    emptyFields.forEach((element) => {
      element.classList.add("input--invalid");
    });

    return alert("Please fill all the inputs");
  }
  // Creating object for POST request
  const requestObj = {
    title: formElements[0].value,
    priority: formElements[1].value,
    description: formElements[2].value,
    time_box: {
      // start: [Hour, Minute, Period]
      start: [
        parseInt(formElements[3].value),
        parseInt(formElements[4].value),
        formElements[5].value,
      ],
      // to: [Hour, Minute, Period]
      to: [
        parseInt(formElements[6].value),
        parseInt(formElements[7].value),
        formElements[8].value,
      ],
    },
  };

  const token = localStorage.getItem("token");
  try {
    await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/api/todos/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(requestObj),
    });

    handleCloseModal(e);
    alert("task has been successfully added");

    await fetchUserData(token.split(" ")[1]);
  } catch (err) {
    localStorage.clear("token");
    resetVars();
    redirect("/pages/login");
    return console.error("Error while adding task");
  }
}
