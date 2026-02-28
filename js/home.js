// localStorage から進行状況を取得
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

      chapter.sections.forEach((section, index) => {
        const sectionStatus = progress[chapter.id] && progress[chapter.id][index + 1] || "not-started";
        
        const sectionDiv = document.createElement("div");
        sectionDiv.classList.add("section", sectionStatus);
        sectionDiv.innerHTML = `
          <span>セクション ${index + 1}: ${section.title}</span>
        `;
        
        // セクションクリックで遷移
        sectionDiv.addEventListener("click", () => {
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