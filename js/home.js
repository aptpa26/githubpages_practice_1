// 進行状況をローカルストレージに保存
function getProgress() {
  const saved = localStorage.getItem("chapters");
  return saved ? JSON.parse(saved) : {};
}

function setProgress(chapterId, sectionId, status) {
  const progress = getProgress();
  if (!progress[chapterId]) {
    progress[chapterId] = {};
  }
  progress[chapterId][sectionId] = status;  // セクションごとの進行状況
  localStorage.setItem("chapters", JSON.stringify(progress));
}

// チャプターを動的に生成
fetch('data/chapters.json') // chapters.json にチャプターとセクションの情報を格納
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
          location.href = `section.html?chapterId=${chapter.id}&sectionId=${index + 1}`;
        });

        chapterDiv.appendChild(sectionDiv);
      });

      container.appendChild(chapterDiv);
    });
  });