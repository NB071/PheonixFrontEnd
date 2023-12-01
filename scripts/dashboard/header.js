import redirect from "../utils/redirect.js";
import { resetVars, setUserInfo } from "../variables/reducers.js";
import variables from "../variables/variables.js";

export async function fetchUserInfo(toekn) {
  try {
    const response = await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + toekn,
      },
    });
    if (response.ok) {
      const userInfo = await response.json();
      if (userInfo) {
        return setUserInfo(userInfo);
      }
    } else {
      resetVars();
      redirect("/pages/login");
      throw new Error();
    }
  } catch (err) {
    localStorage.clear("token");
    return console.error("Error while fetching user Info");
  }
}

/**
 * Fetches user information from the specified JSON file and updates the user area with the retrieved data.
 *
 * @async
 * @function placeUserInfo
 * @param {string} userId - The ID of the user for whom to fetch and display information.
 * @returns {Promise<void>} A Promise that resolves once the user information is placed, or rejects on error.
 */
export async function placeUserInfo(token) {
  try {
    await fetchUserInfo(token);

    // placing users info
    const userAreaElement = document.querySelector(".user-area__info__name");
    const userAreaAvatarElement = document.querySelector(".user-area__avatar");

    const nameIndex = userAreaElement.textContent.indexOf("-");
    // Put user's name in the user area
    if (nameIndex !== -1) {
      userAreaElement.childNodes[2].textContent = variables.userInfo?.name;
    }
    // put user avatar in the user area
    userAreaAvatarElement.src = variables.userInfo?.avatar;

    if (variables.userInfo?.background) {
      document.body.style.background = `url(${variables.userInfo?.background})`;
      document.body.classList.add("uploaded-image");
    }
    if (variables.userInfo?.clock_style) {
      const { color, font_family } = variables.userInfo.clock_style;

      const clock = document.querySelector(".clock__timer");
      const calendar = document.querySelector(".clock__date");

      clock.style.color = color;
      clock.style.fontFamily = font_family;

      calendar.style.color = color;
      calendar.style.fontFamily = font_family;
    }
    console.log(variables.userInfo);
  } catch (error) {
    console.error("An error occurred:", error);
    throw new Error();
  }
}

/**
 * Handles the logout process by clearing the authentication token and redirecting to the login page.
 *
 * @function handleLogOut
 * @returns {void} Returns undefined.
 */
export function handleLogOut() {
  // Clear the authentication token from localStorage
  localStorage.clear("token");

  // Redirect to the login page
  location.pathname = "/pages/login";
}

/**
 * Creates a user menu and appends it to the header.
 *
 * @function createUserMenu
 * @returns {void} Returns undefined.
 */
export function createUserMenu() {
  // toggle the menu if its open
  const isUserMenuOpen = document.querySelector(".user-menu");
  if (isUserMenuOpen) {
    return isUserMenuOpen.remove();
  }

  // Menu <div> parent
  const userMenu = document.createElement("div");
  userMenu.classList.add("user-menu");

  // Children of user menu
  // Setting button
  const item1 = document.createElement("button");
  item1.classList.add("user-menu__settings");
  item1.textContent = "Settings";

  // Divider
  const divider = document.createElement("div");
  divider.classList.add("user-menu__divider");

  // Logout button
  const item2 = document.createElement("button");
  item2.classList.add("user-menu__logout");
  item2.textContent = "Log out";
  item2.addEventListener("click", () => handleLogOut());

  // Append children to user menu
  userMenu.append(item1, divider, item2);

  // Append the menu to header
  const header = document.querySelector(".header");
  header.appendChild(userMenu);
}
