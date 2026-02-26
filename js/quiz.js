const params = new URLSearchParams(location.search);
const chapterId = params.get("id");

const quizzes = [
  [
    { q: "問題1?", a: ["答え1", "答え2"], correct: 0 },
    { q: "問題2?", a: ["答えA", "答えB"], correct: 1 }
  ],
  [
    { q: "別チャプ1?", a: ["答X", "答Y"], correct: 1 }
  ]
];

const quizSection = document.getElementById("quizSection");
const resultArea = document.getElementById("result");
const homeBtn = document.getElementById("homeBtn");

let score = 0;
let currentIndex = 0;

function showQuestion() {
  const item = quizzes[chapterId - 1][currentIndex];
  quizSection.innerHTML = `<p>${item.q}</p>`;

  item.a.forEach((ans, ai) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => {
      if (ai === item.correct) score++;
      currentIndex++;
      if (currentIndex < quizzes[chapterId - 1].length) {
        showQuestion();
      } else {
        showResult();
      }
    };
    quizSection.appendChild(btn);
  });
}

function showResult() {
  quizSection.style.display = "none";
  resultArea.innerHTML = `
    <h3>結果</h3>
    <p>正答率：${((score / quizzes[chapterId - 1].length) * 100).toFixed(1)}%</p>
  `;
  homeBtn.style.display = "block";
  homeBtn.onclick = () => location.href = "index.html";
}

showQuestion();