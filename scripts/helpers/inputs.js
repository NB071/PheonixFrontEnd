// onBlur function for modal inputs
export function onBlurHour(event) {
  const value = Number(event.target.value);
  if (value < 0 || !Number.isSafeInteger(value)) {
    return (event.target.value = 1);
  } else if (value > 23) {
    return (event.target.value = 23);
  }
}

export function onBlurMinute(event) {
  const value = Number(event.target.value);
  if (value < 0 || !Number.isSafeInteger(value)) {
    return (event.target.value = 1);
  } else if (value > 59) {
    return (event.target.value = 59);
  }
}

export function onBlurDay(event) {
  const value = Number(event.target.value);
  if (value < 1 || !Number.isSafeInteger(value)) {
    return (event.target.value = 1);
  } else if (value > 31) {
    return (event.target.value = 31);
  }
}

export function onBlurMonth(event) {
  const value = Number(event.target.value);
  if (value < 1 || !Number.isSafeInteger(value)) {
    return (event.target.value = 1);
  } else if (value > 12) {
    return (event.target.value = 12);
  }
}

export function onBlurYear(event) {
  const value = Number(event.target.value);
  const currentYear = new Date().getFullYear();
  console.log(value > currentYear + 100);
  if (
    value < currentYear ||
    !Number.isSafeInteger(value) ||
    value > currentYear + 80
  ) {
    return (event.target.value = currentYear);
  }
}
