/**
 * Closes the modal by removing with its overlay.
 *
 * @function handleCloseModal
 * @returns {void|null} Returns undefined if the modal overlay is removed, or null if the overlay is not found.
 */
export function handleCloseModal(e) {
  e.preventDefault();
  const modalOverlay = document.querySelectorAll("div[open]");
  return modalOverlay[modalOverlay.length - 1].remove() ?? null;
}

/**
 * Creates a modal with specified properties.
 *
 * @param {Object} options - The options for creating the modal.
 * @param {string} options.modalClass - The CSS class for the modal overlay.
 * @param {Array} options.modalIconClass - An array containing the type and name of the icon for the modal.
 * @param {string} options.modalTitle - The title of the modal.
 * @param {string} options.modalDescription - The description of the modal.
 * @returns {Array} An array containing the modal overlay and modal box elements.
 */
export function createModal({
  modalClass,
  modalIconClass,
  modalTitle,
  modalDescription,
}) {
  // Modal overlay - parent
  const modal = document.createElement("div");
  modal.classList.add(modalClass);

  // Modal box < child - parent
  const modalBox = document.createElement("div");
  modalBox.classList.add(`${modalClass}__container`);

  // Close icon
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");
  closeIcon.addEventListener("click", (e) => handleCloseModal(e));

  // Append close Icon
  modalBox.appendChild(closeIcon);

  // Modal info content Parent
  const modalInfo = document.createElement("div");
  modalInfo.classList.add(`${modalClass}__modal-info`);

  const iconContainer = document.createElement("div");
  iconContainer.classList.add(`${modalClass}__icon`);

  // Modal icon < Child
  const [iconType, iconName] = modalIconClass;
  const icon = document.createElement("i");
  icon.classList.add(iconType, iconName);

  // Append the icon
  iconContainer.appendChild(icon);

  // Set the modal title
  const title = document.createElement("h2");
  title.classList.add(`${modalClass}__title`);
  title.textContent = modalTitle;

  // Set the modal description
  const description = document.createElement("p");
  description.classList.add(`${modalClass}__description`);
  description.textContent = modalDescription;

  modalInfo.append(iconContainer, title, description);

  modalBox.appendChild(modalInfo);

  // Append the box to modal
  modal.appendChild(modalBox);
  // Return the modal overlay and modal box elements as an array
  return [modal, modalBox];
}

export function anyModalPresent() {
  const anyModalPresent = document.querySelector("body > div[open]");
  return !!anyModalPresent
}
