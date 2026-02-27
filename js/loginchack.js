// logincheck.js

const GAS_URL = "https://script.google.com/macros/s/AKfycbwNrCeV86YSoLym46BCSDBDli3k34TN74--TDrnU-vPXOiG_-tnguE_fR81FVcr7DYTSQ/exec";

async function checkLoginAndRedirect() {
  // ローカルストレージからトークンを取得
  const token = localStorage.getItem("token");

  if (!token) {
    // トークンがない → ログインページへ
    window.location.href = "index.html";
    return;
  }

  try {
    // サーバー側で token が有効か確認する
    const res = await fetch(GAS_URL + "?path=checkToken", {
      method: "POST",
      body: JSON.stringify({ token })
    });

    // res.ok は HTTP ステータスが 200〜299 の時 true
    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const result = await res.json();
    if (!result.ok) {
      // 認証結果が false ならログインページへ
      window.location.href = "index.html";
      return;
    }

    // 認証済みなら問題なくページ表示
    console.log("Logged in 🎉");

  } catch (err) {
    // エラー時もログインへ
    window.location.href = "index.html";
  }
}