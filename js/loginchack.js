// ページ読み込み時に認証チェック
const token = localStorage.getItem("token");
if (!token) {
  //ログインページへ戻す
  window.location.href = "index.html";
} else {
  //サーバー側に token が有効か確認
  const res = await fetch(GAS_URL + "?path=checkToken", {
    method:"POST",
    body: token
  });
  if (!res.ok) {
    window.location.href = "index.html";
  } else {
    showContent(); // 認証済みなら本来の内容を表示
  }
}