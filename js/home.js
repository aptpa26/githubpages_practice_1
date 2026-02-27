const GAS_URL = "https://script.google.com/macros/s/AKfycbwNrCeV86YSoLym46BCSDBDli3k34TN74--TDrnU-vPXOiG_-tnguE_fR81FVcr7DYTSQ/exec";

// ページ読み込み後に実行（defer前提）
init();

async function init() {
  const token = localStorage.getItem("token");

  try {
    const data = await fetchHomeData(token);
    renderChapters(data.chapters, data.progress, token);
  } catch (err) {
    console.error("Home init error:", err);
    alert("データの取得に失敗しました");
  }
}

// ==============================
// GASからchapters & progress取得
// ==============================
async function fetchHomeData(token) {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      path: "getHomeData",
      token: token
    })
  });

  if (!res.ok) throw new Error("Network error");

  const data = await res.json();

  if (data.error) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
    throw new Error(data.error);
  }

  return data;
}

// ==============================
// チャプター描画
// ==============================
function renderChapters(chapters, progress, token) {
  const container = document.getElementById("chapters");
  container.innerHTML = "";

  chapters.forEach(chapter => {
    let status = progress?.[chapter.id] || "not-started";

    const card = document.createElement("div");
    card.className = `card ${status}`;

    const statusText = getStatusText(status);

    card.innerHTML = `
      <div class="title">${chapter.title}</div>
      <div class="status-badge">${statusText}</div>
      <div class="status-bar"></div>
    `;

    // クリック時に進捗更新＆ページ遷移
    card.addEventListener("click", async () => {
      if (status !== "completed") {
        // in-progressに更新
        await updateProgress(chapter.id, "in-progress", token);
        status = "in-progress";
        card.classList.remove("not-started");
        card.classList.add("in-progress");
        card.querySelector(".status-badge").textContent = getStatusText(status);
      }
      // チャプターページへ
      window.location.href = `chapter.html?id=${chapter.id}`;
    });

    container.appendChild(card);
  });
}

// ==============================
// ステータス文言
// ==============================
function getStatusText(status) {
  if (status === "completed") return "完了";
  if (status === "in-progress") return "進行中";
  return "未履修";
}

// ==============================
// GASに進捗を送信
// ==============================
async function updateProgress(chapterId, status, token) {
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        path: "updateProgress",
        token: token,
        chapterId: chapterId,
        status: status
      })
    });

    const data = await res.json();
    if (!data.ok) console.warn("進捗更新失敗:", data);
  } catch (err) {
    console.error("進捗更新エラー:", err);
  }
}