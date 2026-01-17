js

(() => {
  const setYear = () => {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setYear);
  } else {
    setYear();
  }
})();
