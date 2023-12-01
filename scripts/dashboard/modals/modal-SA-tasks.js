import { createModal } from "../../helpers/manageModal.js";
import { isTodoPassedDeadline, timeTo24 } from "../../helpers/due.js";
import { openModifyTask } from "./modal-task.js";

function calcucalteDue({ start: startDate, to: dueDate }) {
  const [startHour, startMinutes] = timeTo24(startDate);
  const [dueHour, dueMinutes] = timeTo24(dueDate);

  const newHour = dueHour - startHour;
  const newMinute = dueMinutes - startMinutes;
console.log(dueHour, startHour);
  // If paramters are not valid
  if (newHour < 0 || newMinute < 0) return -1;

  if (newHour === 0) {
    if (newMinute === 0) {
      return "-";
    } else {
      return `${newMinute}m`;
    }
  } else {
    if (dueMinutes === 0) {
      return `${newHour}h:00`;
    } else {
      return `${newHour}h:${dueMinutes}m`;
    }
  }
}

function mapPriority(priority) {
  const priorityMap = { 1: "Low", 2: "Medium", 3: "High" };
  const mappedPriority = priorityMap?.[priority];
  return mappedPriority ?? "-";
}

export default function openSATasks(tasksArray) {
  const totalTasks = tasksArray.length;
  const remainingTasks = tasksArray.filter(
    (task) => !isTodoPassedDeadline("task", task.time_box.to)
  );
  const [modal, modalBox] = createModal({
    modalClass: "SA-tasks",
    modalIconClass: ["fa-solid", "fa-list-check"],
    modalTitle: "See all Tasks",
    modalDescription: "Here you can see all tasks that you created",
  });
  modal.setAttribute("open", "");

  // Stats (Total/Remaining)
  const taskStats = document.createElement("div");
  taskStats.classList.add("SA-tasks__stats");

  // Total wrapper
  const totalWrapper = document.createElement("div");
  totalWrapper.classList.add("SA-tasks__total-tasks");
  const totalText = document.createElement("span");
  totalText.classList.add("SA-tasks__total-text");
  totalText.textContent = "Total";
  const totalNumber = document.createElement("span");
  totalNumber.classList.add("SA-tasks__total-number");
  totalNumber.textContent = totalTasks > 99 ? "99+" : totalTasks;

  totalWrapper.append(totalText, totalNumber);

  // Divider
  const divider = document.createElement("div");
  divider.classList.add("SA-tasks__divider");

  // Remaining
  const remainingWrapper = document.createElement("div");
  remainingWrapper.classList.add("SA-tasks__remaining-tasks");
  const remainingText = document.createElement("span");
  remainingText.classList.add("SA-tasks__remaining-text");
  remainingText.textContent = "Remaining";
  const remainingNumber = document.createElement("span");
  remainingNumber.classList.add("SA-tasks__remaining-number");
  remainingNumber.textContent =
    remainingTasks.length > 99 ? "99+" : remainingTasks.length;

  remainingWrapper.append(remainingText, remainingNumber);

  taskStats.append(totalWrapper, divider, remainingWrapper);

  // all tasks wrapper
  const allTasks = document.createElement("div");
  allTasks.classList.add("SA-tasks__cards-wrapper");
  tasksArray.forEach(({ id, time_box, title, description, priority, done }) => {
    const CPDueNumber = done ? "-" : calcucalteDue(time_box);

    // Card Element
    const cardEl = document.createElement("article");
    cardEl.classList.add("SA-tasks__task");
    cardEl.setAttribute("key", `task-P${id}X`);
    cardEl.addEventListener("click", () =>
      openModifyTask({ id, title, priority, description, time_box })
    );

    // left
    const cardInfo = document.createElement("div");
    cardInfo.classList.add("SA-tasks__card-info");

    // Icon
    const cardIcon = document.createElement("i");
    cardIcon.classList.add("SA-tasks__card-icon", "fa-solid", "fa-school");

    // task info wrapper
    const taskInfoWrapper = document.createElement("div");
    taskInfoWrapper.classList.add("SA-tasks__task-info-wrapper");

    // Task title/desc
    const taskTitle = document.createElement("h2");
    taskTitle.classList.add("SA-tasks__card-title");
    taskTitle.textContent = `Task "${title}"`;

    const taskDescription = document.createElement("h2");
    taskDescription.classList.add("SA-tasks__card-description");
    taskDescription.textContent = `Description: ${description}`;

    taskInfoWrapper.append(taskTitle, taskDescription);

    cardInfo.append(cardIcon, taskInfoWrapper);

    // Right
    const cardProgress = document.createElement("div");
    cardProgress.classList.add("SA-tasks__card-progress");

    // Due
    const CPDue = document.createElement("p");
    CPDue.classList.add("SA-tasks__card-due");

    // conditions for due output
    const CPDueText = document.createElement("span");
    CPDueText.classList.add("SA-tasks__card-due-text");
    CPDueText.textContent = "Due: ";

    CPDue.append(CPDueText, CPDueNumber);

    // Done
    const isDone = document.createElement("p");
    isDone.classList.add("SA-tasks__card-done");

    // conditions for due output
    const isDoneText = document.createElement("span");
    isDoneText.classList.add("SA-tasks__card-done-text");
    isDoneText.textContent = "Done: ";

    const isDoneValue = document.createTextNode(
      `${done ? "Yes" : "No"}`
    );

    isDone.append(isDoneText, isDoneValue);

    // Priority
    const priorityP = document.createElement("p");
    priorityP.classList.add("SA-tasks__card-priority");

    // conditions for due output
    const priorityText = document.createElement("span");
    priorityText.classList.add("SA-tasks__card-priority-text");
    priorityText.textContent = "Priority: ";

    const mappedPriority = mapPriority(priority);
    priorityP.append(priorityText, mappedPriority);

    cardProgress.append(CPDue, isDone, priorityP);
    cardEl.append(cardInfo, cardProgress);
    allTasks.appendChild(cardEl);
  });

  modalBox.append(taskStats, allTasks);
  modal.appendChild(modalBox);
  document.body.appendChild(modal);
}
