const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // ページリロードを止める
  window.location.href = "home.html";
});