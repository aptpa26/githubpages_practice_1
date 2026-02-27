// logincheck.js

const GAS_URL = "https://script.google.com/macros/s/AKfycbwNrCeV86YSoLym46BCSDBDli3k34TN74--TDrnU-vPXOiG_-tnguE_fR81FVcr7DYTSQ/exec";

async function checkLoginAndRedirect() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token → redirecting to login");
    window.location.href = "index.html"; // login
    return;
  }

  try {
    const res = await fetch(`${GAS_URL}?path=checkToken`, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token })
    });

    const result = await res.json();
    console.log("Token check:", result);

    if (!result.ok) {
      console.log("Token invalid → redirect to login");
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  } catch (err) {
    console.error("Error checking token:", err);
    window.location.href = "index.html";
  }
}