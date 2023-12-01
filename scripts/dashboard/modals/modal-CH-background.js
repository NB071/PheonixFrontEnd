import { createModal, handleCloseModal } from "../../helpers/manageModal.js";
import redirect from "../../utils/redirect.js";
import { resetVars } from "../../variables/reducers.js";

/**
 * Handles the submit event for changing the background.
 *
 * @param {Event} e - The click event object.
 * @returns {void}
 */
async function handleSubmitBg(e) {
  e.preventDefault();

  const selectedFile = document.querySelector(
    '.change-bg__input-desciption > input[type="file"]'
  ).files[0];

  if (selectedFile) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("backgroundImage", selectedFile);

    try {
      const response = await fetch(
        "https://pheonix-backend-385c2453f5c2.herokuapp.com/api/user/styles/background",
        {
          method: "PUT",
          headers: {
            authorization: token,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const newUrl = await response.json();
        alert("Background image has been successfully updated");
        document.body.style.background = `url(${newUrl.url})`;
        if (!document.body.classList.contains("uploaded-image"))
          document.body.classList.add("uploaded-image");
      }

      handleCloseModal(e);
    } catch (err) {
      localStorage.clear("token");
      resetVars();
      redirect("/pages/login");
      console.error("Error while updating background image:", err);
    }
  } else {
    alert("Please select an image");
  }
}

/**
 * Opens the Change Background modal, allowing the user to select and preview a background image.
 *
 * @returns {void}
 */
export default function openChBgModal() {
  const [modal, modalBox] = createModal({
    modalClass: "change-bg",
    modalIconClass: ["fa-solid", "fa-chalkboard"],
    modalTitle: "Change Background",
    modalDescription: " Select the background image from your computer.",
  });
  modal.setAttribute("open", "");

  // file input container
  const form = document.createElement("form");
  form.setAttribute("method", "dialog");
  form.classList.add("change-bg__form");

  // Form container
  const formContainer = document.createElement("div");
  formContainer.classList.add("change-bg__form-container");

  // Background Image label
  const label = document.createElement("label");
  label.classList.add("change-bg__input-text");
  label.textContent = "Background Image";

  // Input container
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("change-bg__input-container");

  // Input icon
  const inputIcon = document.createElement("div");
  inputIcon.classList.add("change-bg__input-icon");
  const icon = document.createElement("i");
  icon.classList.add("fa-regular", "fa-image");
  inputIcon.appendChild(icon);

  // File input (hidden)
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.setAttribute(
    "accept",
    "image/svg+xml, image/png, image/jpeg, image/gif"
  );
  fileInput.style.display = "none";
  fileInput.addEventListener("change", (e) => handleChangeBackground(e));

  // Input container click event to trigger file input
  inputContainer.addEventListener("click", () => {
    fileInput.click();
  });

  // Input description
  const inputDescription = document.createElement("div");
  inputDescription.classList.add("change-bg__input-desciption");
  const coloredSpan = document.createElement("span");
  coloredSpan.classList.add("change-bg__input-desciption--colored");
  coloredSpan.textContent = "Click to upload";
  const lineBreak = document.createElement("br");
  const descriptionText = document.createTextNode(
    "SVG, PNG, JPG or GIF (max. 1920*1080px)"
  );
  inputDescription.append(coloredSpan, lineBreak, descriptionText, fileInput);

  // Append elements to the input container
  inputContainer.append(inputIcon, inputDescription);

  // Append elements to the form container
  formContainer.append(label, inputContainer);

  // Button wrapper
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("change-bg__button-wrapper");

  // Cancel button
  const cancelButton = document.createElement("button");
  cancelButton.classList.add("button--secondary");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (e) => handleCloseModal(e));
  // Change button
  const changeButton = document.createElement("button");
  changeButton.classList.add("button--primary");
  changeButton.textContent = "Change";
  changeButton.addEventListener("click", (e) => {
    handleSubmitBg(e);
  });

  // Append buttons to the button wrapper
  buttonWrapper.append(cancelButton, changeButton);

  // Append form container and button wrapper to the form
  form.append(formContainer, buttonWrapper);

  modalBox.appendChild(form);
  modal.appendChild(modalBox);
  document.body.appendChild(modal);
}

/**
 * Handles the change event of the background image input. Reads the selected file as a Data URL,
 * displays the selected image as a preview, and replaces the previous image with the description.
 *
 * @param {Event} e - The change event object.
 * @returns {void}
 */
function handleChangeBackground(e) {
  e.preventDefault();

  // Select the file from select images
  const selectedFile = e.target.files[0];

  if (selectedFile) {
    // Use FileReader to read the selected file as a Data URL
    const reader = new FileReader();

    const maxSizeInBytes = 100000000; // 100 MB

    if (selectedFile.size > maxSizeInBytes) {
      alert(
        `File size exceeds the maximum allowed (100 MB). Please select a smaller file.`
      );
      // Clear the file input value and remove the preview
      return (fileInput.value = "");
    }
    // Load the img
    reader.onload = (e) => {
      const dataURL = e.target.result;

      // Create an Image object to check dimensions
      const img = new Image();
      img.src = dataURL;

      img.onload = () => {
        const maxWidth = 1920;
        const maxHeight = 1080;

        // Check if the dimensions exceed the limit
        if (img.width > maxWidth || img.height > maxHeight) {
          alert("Please select an image with dimensions up to 1920x1080.");
          // Clear the file input value and remove the preview
          e.target.value = "";
          document.querySelector(".change-bg__img-preview")?.remove();
        } else {
          // Replace the image with the description
          const descriptionContainer = document.querySelector(
            ".change-bg__input-desciption"
          );

          document.querySelector(".change-bg__img-preview")?.remove();

          // Display the selected image as a preview
          const imgPrev = document.createElement("img");
          imgPrev.src = dataURL;
          imgPrev.classList.add("change-bg__img-preview");
          descriptionContainer.appendChild(imgPrev);
        }
      };
    };

    // Read the selected file as a Data URL
    reader.readAsDataURL(selectedFile);
  }
}
