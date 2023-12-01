// icon set little animation
const icons = document.querySelectorAll(".icon-set__icon");

// Mac-like icon-lift effect
icons.forEach((icon, index) => {
  icon.addEventListener("mouseenter", () => {
    icon.classList.add("active");
    if (index > 0) {
      icons[index - 1].classList.add("active");
    }
    if (index < icons.length - 1) {
      icons[index + 1].classList.add("active");
    }
  });

  icon.addEventListener("mouseleave", () => {
    icons.forEach((i) => {
      i.classList.remove("active");
    });
  });
});