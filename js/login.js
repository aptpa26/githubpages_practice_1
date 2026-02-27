document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault(); // フォーム送信のページリロードを防ぐ

  const id = document.getElementById("user").value;
  const pw = document.getElementById("pass").value;

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwNrCeV86YSoLym46BCSDBDli3k34TN74--TDrnU-vPXOiG_-tnguE_fR81FVcr7DYTSQ/exec?path=login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, password: pw }),
    });

    const j = await res.json();

    if (j.ok) {
      localStorage.setItem("token", j.token); // トークン保存
      location.href = "form.html"; // 書き込みページに遷移
    } else {
      document.getElementById("status").innerText = "ログインに失敗しました";
    }

  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "通信エラーが発生しました";
  }
});
