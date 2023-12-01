// clock generator for date
export function createDate() {
  const currentDate = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const clockDateElement = document.querySelector(".clock__date");
  clockDateElement.textContent = formattedDate;
}

// clock time updater
export function updateClock() {
  const clockElement = document.querySelector(".clock__timer");
  const hoursElement = clockElement.querySelector(".clock__timer__hour");
  const minutesElement = clockElement.querySelector(".clock__timer__minue");
  const secondsElement = clockElement.querySelector(".clock__timer__second");

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  hoursElement.textContent = hours;
  minutesElement.textContent = minutes;
  secondsElement.textContent = seconds;
}


function handleCloseMenu(e) {
    // Select the menu el
    const menu = document.querySelector(".....")

  if (menu && !menu.contains(e.target)) {
    menu.remove();
  }
}