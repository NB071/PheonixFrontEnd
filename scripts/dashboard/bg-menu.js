import openChBgModal from "./modals/modal-CH-background.js";
import openChClock from "./modals/modal-CH-clock.js";
/**
 * Creates a context menu with options for editing background image and clock style.
 *
 * @function createContextMenu
 * @returns {HTMLDivElement} Returns the created background menu as an HTMLDivElement.
 */
export default function createContextMenu() {
  // Create the menu
  const contextMenu = document.createElement("div");
  contextMenu.classList.add("bg-menu");

  // children of bg menu
  // First button
  const item1 = document.createElement("button");
  item1.classList.add("bg-menu__item", "button--starter-icon");
  item1.textContent = "Edit background image";

  // Edit icon 1
  const editIcon1 = document.createElement("i");
  editIcon1.classList.add("fa-solid", "fa-pen");

  // Prepend the icon to the button
  item1.prepend(editIcon1);
  item1.addEventListener("click", () => removeContextMenu() && openChBgModal());

  const item2 = document.createElement("button");
  item2.classList.add("bg-menu__item", "button--starter-icon");
  item2.textContent = "Edit clock style";

  // Edit icon 2
  const editIcon2 = document.createElement("i");
  editIcon2.classList.add("fa-solid", "fa-pen");

  // Prepend the icon to the button
  item2.prepend(editIcon2);
  item2.addEventListener("click", () => removeContextMenu() && openChClock());

  // Append both items to bg menu
  contextMenu.append(item1, item2);

  return contextMenu;
}

/**
 * Removes the context menu with the specified class.
 * @returns {HTMLElement|null} The removed context menu element, or null if not found.
 */
export function removeContextMenu() {
  const contextMenu = document.querySelector(".bg-menu");

  if (contextMenu) {
    contextMenu.remove();
    return contextMenu;
  }

  return null;
}
