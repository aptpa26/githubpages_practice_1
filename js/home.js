// localStorage から進行状況を取得
function getProgress() {
  const saved = localStorage.getItem("progress");
  return saved ? JSON.parse(saved) : {};
}

// 進行状況を保存
function setProgress(chapterId, videoId, status) {
  const progress = getProgress();
  if (!progress[chapterId]) progress[chapterId] = {};
  progress[chapterId][videoId] = status;
  localStorage.setItem("progress", JSON.stringify(progress));
}

// チャプターとセクションを動的に生成
fetch('data/chapters.json')  // chapters.json にチャプターとセクションの情報が格納されている
  .then(response => response.json())
  .then(chapters => {
    const container = document.getElementById("chapters");
    const progress = getProgress();

    chapters.forEach(chapter => {
      const chapterDiv = document.createElement("div");
      chapterDiv.classList.add("chapter");

      const chapterTitle = document.createElement("h3");
      chapterTitle.innerText = chapter.title;
      chapterDiv.appendChild(chapterTitle);

      chapter.sections.forEach(section => {
        // 各セクションの進行状況を取得
        const sectionStatus = progress[chapter.id] && progress[chapter.id][section.videoId] || "not-started";
        
        const sectionDiv = document.createElement("div");
        sectionDiv.classList.add("section", sectionStatus);
        sectionDiv.innerHTML = `
          <span>セクション: ${section.title}</span>
        `;
        
        // セクションクリックで進行状況を更新
        sectionDiv.addEventListener("click", () => {
          // セクションの進行状況を「in-progress」に更新
          setProgress(chapter.id, section.videoId, "in-progress");
          // 遷移
          location.href = `chapter.html?chapterId=${chapter.id}`;
        });

        chapterDiv.appendChild(sectionDiv);
      });

      container.appendChild(chapterDiv);
    });
  })
  .catch(err => {
    console.error("データの読み込みに失敗しました:", err);
  });