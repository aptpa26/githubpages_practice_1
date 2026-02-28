const params = new URLSearchParams(location.search);
const chapterId = parseInt(params.get("chapterId"), 10);

// チャプター情報を取得
fetch('data/chapters.json')
  .then(response => response.json())
  .then(chapters => {
    const chapter = chapters.find(c => c.id === chapterId);
    const container = document.getElementById("sections");

    chapter.sections.forEach((section, index) => {
      const sectionDiv = document.createElement("div");
      sectionDiv.classList.add("section");
      sectionDiv.innerHTML = `
        <span>セクション ${index + 1}: ${section.title}</span>
      `;
      
      sectionDiv.addEventListener("click", () => {
        location.href = `section.html?chapterId=${chapterId}&sectionId=${index + 1}`;
      });

      container.appendChild(sectionDiv);
    });
  });