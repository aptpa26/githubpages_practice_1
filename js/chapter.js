// ローカルストレージから進行状況を取得
function getProgress() {
  const saved = localStorage.getItem("progress");
  return saved ? JSON.parse(saved) : {};
}

// 進行状況を保存
function setProgress(chapterId, sectionId, status) {
  const progress = getProgress();
  if (!progress[chapterId]) progress[chapterId] = {};
  progress[chapterId][sectionId] = status;
  localStorage.setItem("progress", JSON.stringify(progress));
}

// URLのクエリパラメータを取得
const params = new URLSearchParams(location.search);
const chapterId = parseInt(params.get("chapterId"), 10);

// チャプター情報を取得
fetch("data/chapters.json")
  .then(response => response.json())
  .then(chapters => {
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) {
      alert("チャプターが見つかりません");
      return;
    }

    // チャプタータイトルを設定
    document.getElementById("chapterTitle").textContent = chapter.title;

    const sectionsContainer = document.getElementById("sections");
    const progress = getProgress();

    // 各セクションを表示
    chapter.sections.forEach((section, index) => {
      let status = progress[chapterId] && progress[chapterId][index + 1] || "not-started";

      const sectionCard = document.createElement("div");
      sectionCard.classList.add("card", status);

      sectionCard.innerHTML = `
        <div class="title">${section.title}</div>
        <div class="status-badge">${status === "completed" ? "完了" : (status === "in-progress" ? "進行中" : "未履修")}</div>
        <div class="status-bar"></div>
      `;

      sectionCard.addEventListener("click", () => {
        // セクションカードをクリックしたとき
        location.href = `section.html?chapterId=${chapterId}&sectionId=${index + 1}`;
      });

      sectionsContainer.appendChild(sectionCard);
    });
  })
  .catch(err => {
    console.error("チャプター情報の読み込みに失敗しました:", err);
    alert("チャプター情報の読み込みに失敗しました。");
  });