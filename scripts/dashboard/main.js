import "./footer.js";
import { fetchUserData } from "./todos.js";
import { placeUserInfo, createUserMenu } from "./header.js";
import { updateClock, createDate } from "./clock.js";

import {
  handleOutsideClickUserMenu,
  handleContextMenu,
  handleCloseBGMenu,
} from "./event-listeners.js";
import lockWakeState from "../utils/wakeLock.js";

// close loader
function handleCloseLoader() {
  document.querySelector(".loader").remove();
}

(async function intialization() {
  const token = localStorage.getItem("token")?.split(" ")[1];

  window._dMenus = { createUserMenu };
  
  try {
    // Fetch data from users info and place it in user area
    await placeUserInfo(token);
    
    // Fetch user's todots
    await fetchUserData(token);

    handleCloseLoader();

    // Place the current date
    createDate();

    // Call the function once to initialize the clock
    updateClock();
  } catch (err) {
    console.error("Error: " + err);
  }
  // wakeLock
  lockWakeState();
})();

// Update the clock every second
setInterval(updateClock, 1000);

// Attach the event listener to the window
window.addEventListener("mouseup", (e) => handleOutsideClickUserMenu(e));
window.addEventListener("contextmenu", (e) => handleContextMenu(e));
window.addEventListener("click", (e) => handleCloseBGMenu(e));
