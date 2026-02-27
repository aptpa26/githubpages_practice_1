// ページ読み込み後に実行（defer 前提）
init();

async function init() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("ログイン情報がありません");
    window.location.href = "index.html";
    return;
  }

  try {
    const data = await fetchHomeData(token);

    // ok チェック
    if (!data.ok) {
      localStorage.removeItem("token");
      alert(data.error || "データ取得に失敗しました");
      window.location.href = "index.html";
      return;
    }

    renderChapters(data.chapters || [], data.progress || {}, token);

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
  return data;
}

// ==============================
// チャプター描画
// ==============================
function renderChapters(chapters, progress, token) {
  const container = document.getElementById("chapters");
  container.innerHTML = "";

  if (!chapters.length) {
    container.textContent = "チャプターがありません";
    return;
  }

  chapters.forEach(chapter => {
    // progress が存在しない場合は "not-started" に
    let status = progress[chapter.id] || "not-started";

    const card = document.createElement("div");
    card.className = `card ${status}`;

    card.innerHTML = `
      <div class="title">${chapter.title}</div>
      <div class="status-badge">${getStatusText(status)}</div>
      <div class="status-bar"></div>
    `;

    // クリック時に進捗更新＆ページ遷移
    card.addEventListener("click", async () => {
      try {
        if (status !== "completed") {
          const updated = await updateProgress(chapter.id, "in-progress", token);
          if (updated) {
            status = "in-progress";
            card.classList.remove("not-started");
            card.classList.add("in-progress");
            card.querySelector(".status-badge").textContent = getStatusText(status);
          }
        }
      } catch (err) {
        console.error("進捗更新失敗:", err);
      }

      // ページ遷移
      window.location.href = `chapter.html?id=${chapter.id}`;
    });

    container.appendChild(card);
  });
}

// ==============================
// ステータス文言
// ==============================
function getStatusText(status) {
  switch(status) {
    case "completed": return "完了";
    case "in-progress": return "進行中";
    default: return "未履修";
  }
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
        token,
        chapterId,
        status
      })
    });

    const data = await res.json();
    return data.ok === true;
  } catch (err) {
    console.error("updateProgress error:", err);
    return false;
  }
}