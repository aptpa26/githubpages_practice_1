const GAS_URL = "https://script.google.com/macros/s/AKfycbwNrCeV86YSoLym46BCSDBDli3k34TN74--TDrnU-vPXOiG_-tnguE_fR81FVcr7DYTSQ/exec";

// ページ読み込み後すぐ実行
checkLoginAndRedirect();

async function checkLoginAndRedirect() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token → redirecting to login");
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        path: "checkToken",
        token: token
      })
    });

    const result = await res.json();
    console.log("Token check:", result);

    if (!result.ok) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  } catch (err) {
    console.error("Error checking token:", err);
    window.location.href = "index.html";
  }
}