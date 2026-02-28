const params = new URLSearchParams(location.search);
const chapterId = parseInt(params.get("id"), 10);

// DOM要素
const quizForm = document.getElementById("quizForm");
const submitBtn = document.getElementById("submitBtn");
const resultArea = document.getElementById("result");
const homeBtn = document.getElementById("homeBtn");

// localStorage 共通関数
function getProgress() {
  const saved = localStorage.getItem("chapters");
  return saved ? JSON.parse(saved) : {};
}

function setProgress(chapterId, status) {
  const progress = getProgress();
  progress[chapterId] = status;
  localStorage.setItem("chapters", JSON.stringify(progress));
}

// 動的にCSVファイルを読み込む
const quizFileName = `csv/chapter${chapterId}_quiz.csv`;

fetch(quizFileName)
  .then(res => {
    if (!res.ok) {
      // CSVが存在しない場合やサーバーエラーの場合
      throw new Error(`ファイルが見つかりません: ${quizFileName}`);
    }
    return res.text();  // CSVをテキストとして読み込む
  })
  .then(csv => {
    // CSVをパース
    Papa.parse(csv, {
      header: true,  // ヘッダーをキーとして使う
      dynamicTyping: true,  // 数字やブール値を自動的に適切な型に変換
      complete: function(results) {
        const quizzes = results.data;  // パースしたクイズデータ

        // クイズ項目をフォームに追加
        quizzes.forEach((item, i) => {
          const div = document.createElement("div");
          div.classList.add("quiz-question");
          div.innerHTML = `<p>${i + 1}. ${item.question}</p>`;

          const answers = [item["1"], item["2"], item["3"]];
          const correctAnswer = item.answer - 1;

          answers.forEach((answer, ai) => {
            const id = `q${i}_a${ai}`;
            div.innerHTML += `
              <div>
                <input type="radio" name="q${i}" id="${id}" value="${ai}">
                <label for="${id}">${answer}</label>
              </div>
            `;
          });

          quizForm.appendChild(div);
        });

        // 採点ボタンがクリックされた時の処理
        submitBtn.addEventListener("click", (e) => {
          e.preventDefault();
          resultArea.style.display = "block";

          let score = 0;
          let total = quizzes.length;
          resultArea.innerHTML = "<h3>採点結果</h3>";

          quizzes.forEach((item, i) => {
            const selected = quizForm[`q${i}`].value;
            const correct = item.answer - 1;

            const container = quizForm.querySelector(`div.quiz-question:nth-child(${i + 1})`);
            const labels = container.querySelectorAll("label");

            labels.forEach((label, ai) => {
              label.classList.remove("correct-answer", "incorrect-answer", "not-selected");

              if(ai === correct) label.classList.add("correct-answer");
              if(ai == parseInt(selected)) {
                if(ai === correct) score++;
                else label.classList.add("incorrect-answer");
              } else if(selected === "") {
                label.classList.add("not-selected");
              }
            });

            resultArea.innerHTML += `
              <p>問${i + 1}：${parseInt(selected) === correct ? "✅ 正解" : "❌ 不正解"}</p>
            `;
          });

          const rate = ((score / total) * 100).toFixed(1);
          resultArea.innerHTML += `<p>正答率：${rate}% (${score}/${total})</p>`;

          submitBtn.style.display = "none";
          homeBtn.style.display = "block";

          // ✅ 全問正解なら完了に反映
          if(score === total) {
            setProgress(chapterId, "completed");
          }
        });

        // ホームに戻る
        homeBtn.addEventListener("click", () => location.href = "home.html");
      }
    });
  })
  .catch(err => {
    console.error("CSVの読み込みに失敗しました:", err.message);  // エラーメッセージ
    console.error(err.stack);  // スタックトレースを出力
    window.location.href = "home.html";  // エラー時にホームに戻る
  });