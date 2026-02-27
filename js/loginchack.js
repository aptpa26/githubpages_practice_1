// logincheck.js

const GAS_URL = "https://script.google.com/macros/s/AKfycbwNrCeV86YSoLym46BCSDBDli3k34TN74--TDrnU-vPXOiG_-tnguE_fR81FVcr7DYTSQ/exec";

async function checkLoginAndRedirect() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`${GAS_URL}?path=checkToken`, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token })
    });

    const result = await res.json();
    if (!result.ok) {
      window.location.href = "index.html";
    }
  } catch (err) {
    window.location.href = "index.html";
  }
}