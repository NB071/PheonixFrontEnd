import { anyModalPresent } from "../helpers/manageModal.js";
import createContextMenu from "./bg-menu.js";

/**
 * Closes the user menu when a click event occurs outside of it.
 *
 * @param {MouseEvent} e - The mouseup event object.
 * @returns {void} Returns undefined.
 */
export function handleOutsideClickUserMenu(e) {
  e.preventDefault();
  const userMenu = document.querySelector(".user-menu");
  const userArea = document.querySelector(".user-area");
  if (
    userMenu &&
    !userArea.contains(e.target) &&
    !userMenu.contains(e.target)
  ) {
    userMenu.remove();
  }
}

/**
 * Handles the context menu functionality by creating and displaying a background menu
 * at the specified coordinates on right-click.
 *
 * @function handleContextMenu
 * @param {MouseEvent} e - The mouse event object.
 * @returns {void} Returns undefined.
 */
export function handleContextMenu(e) {
  e.preventDefault();
  anyModalPresent();
  
  // dont open if any modal was open
  if (anyModalPresent()) return;

  const menu = document.querySelector(".bg-menu");
  const userMenu = document.querySelector(".user-menu");

  // Remove the user munu if present
  userMenu?.remove();

  // Remove the menu if present
  menu?.remove();

  const bgMenu = createContextMenu();

  // Prepend menu to bg
  document.body.prepend(bgMenu);

  // Get the coordinates of the mouse
  const coordinates = [e.clientX, e.clientY];

  // Position menu using the coordinates
  bgMenu.style.left = coordinates[0] + "px";
  bgMenu.style.top = coordinates[1] + "px";
}

/**
 * Closes the background menu when a click event occurs outside of it.
 *
 * @function handleCloseBGMenu
 * @param {MouseEvent} e - The mouse event object.
 * @returns {void} Returns undefined.
 */
export function handleCloseBGMenu(e) {
  const bgMenu = document.querySelector(".bg-menu");

  if (bgMenu && !bgMenu.contains(e.target)) {
    bgMenu.remove();
  }
}
