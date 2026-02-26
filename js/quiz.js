const params = new URLSearchParams(location.search);
const chapterId = params.get("id");

// クイズデータ
const quizzes = [
  [
    {
      q: "問題1: JavaScriptの変数を宣言するときのキーワードは？",
      a: ["var", "foo", "1st"],
      correct: 0
    },
    {
      q: "問題2: 配列の最後に値を追加するメソッドは？",
      a: ["pop()", "push()", "shift()"],
      correct: 1
    }
  ],
  [
    {
      q: "別チャプ1: HTMLのタグはどれ？",
      a: ["<>", "!!", "<html>"],
      correct: 2
    }
  ]
];

// DOM
const quizForm = document.getElementById("quizForm");
const submitBtn = document.getElementById("submitBtn");
const resultArea = document.getElementById("result");
const homeBtn = document.getElementById("homeBtn");

// 表示
quizzes[chapterId - 1].forEach((item, i) => {
  const div = document.createElement("div");
  div.classList.add("quiz-question");
  div.innerHTML = `<p>${i + 1}. ${item.q}</p>`;

  item.a.forEach((ans, ai) => {
    const id = `q${i}_a${ai}`;
    div.innerHTML += `
      <div>
        <input type="radio" name="q${i}" id="${id}" value="${ai}">
        <label for="${id}">${ans}</label>
      </div>
    `;
  });

  quizForm.appendChild(div);
});

// 採点処理
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let score = 0;
  let total = quizzes[chapterId - 1].length;

  resultArea.innerHTML = "<h3>採点結果</h3>";

  quizzes[chapterId - 1].forEach((item, i) => {
    const selected = quizForm[`q${i}`].value;
    const correct = item.correct;

    // 各質問エリアを取得
    const container = quizForm.querySelector(`div.quiz-question:nth-child(${i+1})`);

    // 全ラベルを取得
    const labels = container.querySelectorAll("label");

    labels.forEach((label, ai) => {
      label.classList.remove("correct-answer", "incorrect-answer", "not-selected");

      if (ai == correct) {
        // 正解ラベル
        label.classList.add("correct-answer");
      }
      if (ai == parseInt(selected)) {
        // ユーザー選択
        if (ai == correct) {
          score++;
        } else {
          label.classList.add("incorrect-answer");
        }
      } else if (selected === "") {
        // 選択なしの場合
        label.classList.add("not-selected");
      }
    });

    resultArea.innerHTML += `
      <p>
        問${i + 1}：
        ${parseInt(selected) === correct ? "✅ 正解" : "❌ 不正解"} 
      </p>
    `;
  });

  const rate = ((score / total) * 100).toFixed(1);
  resultArea.innerHTML += `<p>正答率：${rate}% (${score}/${total})</p>`;

  submitBtn.style.display = "none";
  homeBtn.style.display = "block";
});

// ホームへ戻る
homeBtn.addEventListener("click", () => {
  location.href = "home.html";
});