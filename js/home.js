// 共通 localStorage 関数
function getProgress() {
  const saved = localStorage.getItem("chapters");
  return saved ? JSON.parse(saved) : {};
}

function setProgress(chapterId, status) {
  const progress = getProgress();
  progress[chapterId] = status;
  localStorage.setItem("chapters", JSON.stringify(progress));
}

// CSV読み込み＆カード生成
fetch("csv/chapters.csv")
  .then(res => res.text())  // CSVをテキストとして読み込む
  .then(csv => {
    // PapaParseでCSVをパース
    Papa.parse(csv, {
      header: true,  // ヘッダーをキーとして使う
      dynamicTyping: true,  // 数字やブール値を自動的に適切な型に変換
      complete: function(results) {
        const chapters = results.data;  // パースしたデータ
        const container = document.getElementById("chapters");
        const progress = getProgress();

        chapters.forEach(chapter => {
          // ローカルストレージ優先、なければ未履修
          let status = progress[chapter.id] || "not-started";

          const card = document.createElement("div");
          card.className = `card ${status}`;

          card.innerHTML = `
            <div class="title">${chapter.title}</div>
            <div class="status-badge">${status === "completed" ? "完了" : (status === "in-progress" ? "進行中" : "未履修")}</div>
            <div class="status-bar"></div>
          `;

          // カードクリックで in-progress に更新＋チャプターへ遷移
          card.addEventListener("click", () => {
            if(status !== "completed") {
              setProgress(chapter.id, "in-progress");
              card.classList.remove("not-started");
              card.classList.add("in-progress");
              card.querySelector(".status-badge").textContent = "進行中";
              status = "in-progress";
            }
            location.href = `chapter.html?id=${chapter.id}`;
          });

          container.appendChild(card);
        });
      }
    });
  })
  .catch(err => {
    console.error("CSVの読み込みに失敗しました:", err);
  });