const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // ページリロードを止める

  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  // ここでは仮のログインチェック
  if (username === "user" && password === "pass") {
    // 成功 → home.htmlへ移動
    window.location.href = "home.html";
  } else {
    alert("ログイン失敗");
  }
});