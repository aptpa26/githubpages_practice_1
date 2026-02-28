const params = new URLSearchParams(location.search);
const chapterId = parseInt(params.get("chapterId"), 10);
const sectionId = parseInt(params.get("sectionId"), 10);

// セクションデータの読み込み
fetch('data/chapters.json')
  .then(response => response.json())
  .then(chapters => {
    const chapter = chapters.find(c => c.id === chapterId);
    const section = chapter.sections[sectionId - 1];

    document.getElementById("section-title").innerText = section.title;

    // 動画の設定
    const videoUrl = `https://www.youtube.com/embed/${section.videoId}?rel=0&modestbranding=1`;
    document.getElementById("ytVideo").src = videoUrl;

    // クイズボタン
    document.getElementById("goQuizBtn").addEventListener("click", () => {
      location.href = `chapter-quiz.html?chapterId=${chapterId}&sectionId=${sectionId}`;
    });
  });