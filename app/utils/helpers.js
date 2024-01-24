export function rejectBackButton() {
  history.pushState(null, null, location.href);
  window.onpopstate = () => {
    history.go(1);
  };
}

export function parseJSONSafely(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}
