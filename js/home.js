// ローカルストレージから進行状況を取得
function getProgress() {
  const saved = localStorage.getItem("progress");
  return saved ? JSON.parse(saved) : {};  // progress が null でも空のオブジェクトを返す
}

// 進行状況を保存
function setProgress(chapterId, sectionId, status) {
  const progress = getProgress();
  
  // チャプターが存在しない場合は空のオブジェクトを作成
  if (!progress[chapterId]) {
    progress[chapterId] = {};
  }
  
  // セクションの進行状況を保存
  progress[chapterId][sectionId] = status;

  // ローカルストレージに進行状況を保存
  localStorage.setItem("progress", JSON.stringify(progress));
}

// チャプターとセクションのデータを動的に読み込み
fetch('data/chapters.json')  // chapters.json を読み込む（チャプター情報）
  .then(response => response.json())
  .then(chapters => {
    const container = document.getElementById("chapters");
    const progress = getProgress();  // 現在の進行状況を取得

    // チャプターごとにカードを生成
    chapters.forEach(chapter => {
      // 各セクションに対してカードを生成
      chapter.sections.forEach(section => {
        // 進行状況の取得（未着手、進行中、完了）
        let status = progress[chapter.id] && progress[chapter.id][section.id] || "not-started";

        // statusがundefinedやnullの場合、"not-started"にデフォルト設定
        if (typeof status !== "string") {
          status = "not-started";
        }

        const chapterDiv = document.createElement("div");
        chapterDiv.classList.add("card", status);  // 進行状況に基づいてクラスを変更
        chapterDiv.innerHTML = `
          <div class="title">${section.title}</div>
          <div class="status-badge">${status === "completed" ? "完了" : (status === "in-progress" ? "進行中" : "未履修")}</div>
          <div class="status-bar"></div>
        `;

        // チャプターカードをクリックしたときの遷移
        chapterDiv.addEventListener("click", () => {
          location.href = `section.html?chapterId=${chapter.id}&sectionId=${section.id}`;  // セクションページへ遷移
        });

        container.appendChild(chapterDiv);
      });
    });
  })
  .catch(err => {
    console.error("データの読み込みに失敗しました:", err);
  });