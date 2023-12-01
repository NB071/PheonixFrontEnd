import { createModal, handleCloseModal } from "../../helpers/manageModal.js";
import redirect from "../../utils/redirect.js";
import { resetVars } from "../../variables/reducers.js";
import variables from "../../variables/variables.js";
import { fetchUserInfo } from "../header.js";

export default function openChClock() {
  const [modal, modalBox] = createModal({
    modalClass: "change-clock",
    modalIconClass: ["fa-solid", "fa-palette"],
    modalTitle: "Change clock style",
    modalDescription: " change the style of your clock.",
  });

  modal.setAttribute("open", "");

  // Form
  const form = document.createElement("form");
  form.setAttribute("method", "dialog");
  form.classList.add("change-clock__form");

  // form container
  const formContainer = document.createElement("div");
  formContainer.classList.add("change-clock__form-container");

  // Form color container
  const formColorContainer = document.createElement("div");
  formColorContainer.classList.add("change-clock__color-wrapper");

  // Color label
  const colorLabel = document.createElement("label");
  colorLabel.classList.add("change-clock__input-text");
  colorLabel.textContent = "Color*";

  // Color container
  const colorInputContainer = document.createElement("div");
  colorInputContainer.classList.add("change-clock__input-container");
  // Color input (hidden)
  const colorInput = document.createElement("input");
  colorInput.style.display = "none";
  colorInput.setAttribute("type", "color");
  colorInput.setAttribute("value", variables.userInfo.clock_style.color);
  colorInput.setAttribute("name", "color_input");
  colorInput.setAttribute("required", "");

  // Color container click event to trigger color input
  colorInputContainer.addEventListener("click", () => {
    colorInput.click();
  });

  const colorButton = document.createElement("button");
  colorButton.classList.add("button--end-icon", "change-clock__color-input");
  colorButton.textContent = "Select color from the input";

  // Color icon
  const colorIcon = document.createElement("i");
  colorIcon.classList.add("fa-solid", "fa-paintbrush");

  colorButton.appendChild(colorIcon);

  // Append elements to the color input container
  colorInputContainer.append(colorButton);

  // Append elements to the form container
  formColorContainer.append(colorLabel, colorInputContainer);

  // Form font container
  const formFontContainer = document.createElement("div");
  formFontContainer.classList.add("change-clock__font-wrapper");

  // Font label
  const fontLabel = document.createElement("label");
  fontLabel.classList.add("change-clock__input-text");
  fontLabel.textContent = "Font Style*";

  // Font container
  const fontSelectContainer = document.createElement("div");
  fontSelectContainer.classList.add("change-clock__input-container");

  // Font select
  const { clock_style } = variables.userInfo;

  const fontSelect = document.createElement("select");
  fontSelect.setAttribute("name", "font_input");

  const fontOptions = [
    { value: "Archivo", textContent: "Archivo" },
    { value: "Poppins", textContent: "Poppins" },
    { value: "Roboto", textContent: "Roboto" },
    { value: "Jost", textContent: "Jost" },
    { value: "Chakra Petch", textContent: "Chakra Petch" },
  ];

  fontOptions.forEach(({ value, textContent }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    if (clock_style.font_family === value) {
      option.setAttribute("selected", "");
    }
    fontSelect.appendChild(option);
  });

  // Append elements to the container
  fontSelectContainer.append(fontSelect);

  // Append elements to the form container
  formFontContainer.append(fontLabel, fontSelectContainer);

  // Form preview container
  const formPrevContainer = document.createElement("div");
  formPrevContainer.classList.add("change-clock__form-prev-container");

  // Preview label
  const prevLabel = document.createElement("label");
  prevLabel.classList.add("change-clock__input-text");
  prevLabel.textContent = "Preview";

  // Preview container
  const prev = document.createElement("div");
  prev.classList.add("change-clock__preview-wrapper");
  const prevTime = document.createElement("p");
  prevTime.classList.add("change-clock__prev-time");
  prevTime.textContent = "12:00:00";
  const prevDate = document.createElement("p");
  prevDate.classList.add("change-clock__prev-date");
  prevDate.textContent = "Saturday, November 25";

  colorInput.addEventListener("input", () => {
    const color = colorInput.value;
    prevDate.style.color = color;
    prevTime.style.color = color;
  });

  fontSelect.addEventListener("input", () => {
    const font = fontSelect.value;
    prevDate.style.fontFamily = font;
    prevTime.style.fontFamily = font;
  });

  // Append elements to the color input container
  prev.append(prevTime, prevDate);

  // Append elements to the form container
  formPrevContainer.append(prevLabel, prev);

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
    handleSubmitClock(e, colorInput.value, fontSelect.value);
  });

  // Append buttons to the button wrapper
  buttonWrapper.append(cancelButton, changeButton);

  // Append form containers and button wrapper to the form
  formContainer.append(
    formColorContainer,
    formFontContainer,
    formPrevContainer
  );

  form.append(formContainer, buttonWrapper);

  modalBox.appendChild(form);

  modal.appendChild(modalBox);
  document.body.appendChild(modal);
}

async function handleSubmitClock(e, colorInput, fontSelect) {
  e.preventDefault();
  const token = localStorage.getItem("token");

  if (!colorInput) {
    return alert("Please select a color");
  }

  const reqObj = {
    font_family: fontSelect,
    color: colorInput,
  };

  try {
    const response = await fetch(
      "https://pheonix-backend-385c2453f5c2.herokuapp.com/api/user/styles/clock",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(reqObj),
      }
    );
    if (response.ok) {
      alert("clock style has been successfully updated");
      const clock = document.querySelector(".clock__timer");
      const calendar = document.querySelector(".clock__date");
      
      clock.style.color = colorInput;
      clock.style.fontFamily = fontSelect;

      calendar.style.color = colorInput;
      calendar.style.fontFamily = fontSelect;
    }

    await fetchUserInfo(token.split(" ")[1])
    handleCloseModal(e);
  } catch (err) {
    localStorage.clear("token");
    resetVars();
    redirect("/pages/login");
    console.error("Error while updating clock style:", err);
  }
}
