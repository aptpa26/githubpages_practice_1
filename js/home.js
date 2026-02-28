// ローカルストレージから進行状況を取得
function getProgress() {
  const saved = localStorage.getItem("progress");
  return saved ? JSON.parse(saved) : {};
}

// 進行状況を保存
function setProgress(chapterId, status) {
  const progress = getProgress();
  progress[chapterId] = status;
  localStorage.setItem("progress", JSON.stringify(progress));
}

// チャプターとセクションのデータを動的に読み込み
fetch('data/chapters.json')  // chapters.json を読み込む（チャプター情報）
  .then(response => response.json())
  .then(chapters => {
    const container = document.getElementById("chapters");
    const progress = getProgress();

    // チャプターごとにカードを生成
    chapters.forEach(chapter => {
      // 進行状況の取得（未着手、進行中、完了）
      let status = progress[chapter.id] || "not-started";

      const chapterDiv = document.createElement("div");
      chapterDiv.classList.add("card", status);  // 進行状況に基づいてクラスを変更
      chapterDiv.innerHTML = `
        <div class="title">${chapter.title}</div>
        <div class="status-badge">${status === "completed" ? "完了" : (status === "in-progress" ? "進行中" : "未履修")}</div>
        <div class="status-bar"></div>
      `;

      // チャプターカードをクリックしたときの遷移
      chapterDiv.addEventListener("click", () => {
        location.href = `chapter.html?chapterId=${chapter.id}`;  // チャプター詳細ページへ遷移
      });

      container.appendChild(chapterDiv);
    });
  })
  .catch(err => {
    console.error("データの読み込みに失敗しました:", err);
  });