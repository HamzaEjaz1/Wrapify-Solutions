const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const themeToggle = document.getElementById("themeToggle");

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

const savedTheme = localStorage.getItem("wrapify-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("wrapify-theme", isDark ? "dark" : "light");
  });
}

document.querySelectorAll('.main-nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => mainNav?.classList.remove("open"));
});
