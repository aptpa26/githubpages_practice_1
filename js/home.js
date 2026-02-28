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
      // チャプター内のすべてのセクションの進行状況を取得
      let status = "not-started"; // デフォルトは未履修
      let completedCount = 0;
      let inProgressCount = 0;
      let totalSections = Object.keys(chapter.sections).length;

      // セクションごとの進行状況を確認
      if (progress[chapter.id]) {
        const sections = progress[chapter.id];
        // セクションごとに最も進んだ状態を反映（完了 → 進行中 → 未履修）
        Object.values(sections).forEach(secStatus => {
          if (secStatus === "completed") {
            completedCount++;
          } else if (secStatus === "in-progress") {
            inProgressCount++;
          }
        });

        // チャプターの進行状況の判定
        if (completedCount === totalSections) {
          status = "completed";
        } else if (inProgressCount > 0) {
          status = "in-progress";
        } else {
          status = "not-started";
        }
      }

      // プログレスバーの割合計算
      let progressBarWidth = (completedCount / totalSections) * 100;

      const chapterDiv = document.createElement("div");
      chapterDiv.classList.add("card", status);  // 進行状況に基づいてクラスを変更
      chapterDiv.innerHTML = `
        <div class="title">${chapter.title}</div>
        <div class="status-badge">${status === "completed" ? "完了" : (status === "in-progress" ? "進行中" : "未履修")}</div>
        <div class="status-bar-container">
          <div class="status-bar" style="width: ${progressBarWidth}%;"></div>
        </div>
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