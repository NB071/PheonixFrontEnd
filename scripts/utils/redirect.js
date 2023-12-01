/**
 * Redirects the user to the specified URL.
 *
 * @param {string} url - The URL to which the user should be redirected.
 * @returns {string} The new URL after redirection.
 */
export default function redirect(url) {
  /**
   * Using the assignment in the return statement to immediately change the window location.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/assign}
   */
  return (window.location.href = url);
}
