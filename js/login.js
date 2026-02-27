// GASのURLを定義（環境に合わせて置き換え）
const GAS_URL = "https://script.google.com/macros/s/AKfycbwNrCeV86YSoLym46BCSDBDli3k34TN74--TDrnU-vPXOiG_-tnguE_fR81FVcr7DYTSQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", async () => {
    const id = document.getElementById("id").value.trim();
    const pw = document.getElementById("pw").value;

    if (!id || !pw) {
      alert("ユーザー名とパスワードを入力してください");
      return;
    }

    try {
      const res = await fetch(`${GAS_URL}?path=login`, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ id, password: pw })
      });

      const j = await res.json();
      if (j.ok && j.token) {
        localStorage.setItem("token", j.token);
        window.location.href = "home.html";
      } else {
        alert("ログインに失敗しました");
      }
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
    }
  });
});