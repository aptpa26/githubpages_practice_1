// クエリパラメータの取得
const params = new URLSearchParams(location.search);
const chapterId = parseInt(params.get("chapterId"), 10);
const sectionId = parseInt(params.get("sectionId"), 10);

// DOM要素
const quizForm = document.getElementById("quizForm");
const submitBtn = document.getElementById("submitBtn");
const resultArea = document.getElementById("result");
const homeBtn = document.getElementById("homeBtn");

// CSVファイルの読み込みと問題表示
const quizFileName = `csv/chapter${chapterId}_section${sectionId}_quiz.csv`;

fetch(quizFileName)
  .then(res => {
    if (!res.ok) {
      // CSVが存在しない場合やサーバーエラー
      throw new Error(`ファイルが見つかりません: ${quizFileName}`);
    }
    return res.text(); // CSVをテキストとして読み込む
  })
  .then(csv => {
    // PapaParseでCSVをパース
    Papa.parse(csv, {
      header: true, // ヘッダーをキーとして使用
      dynamicTyping: true, // 数字やブール値を自動的に適切な型に変換
      complete: function(results) {
        const quizzes = results.data; // パースしたクイズデータ

        // クイズの問題をフォームに追加
        quizzes.forEach((item, i) => {
          const div = document.createElement("div");
          div.classList.add("quiz-question");

          // 問題文を追加
          div.innerHTML = `<p>${i + 1}. ${item.question}</p>`;

          // 選択肢を作成
          const answers = [item["1"], item["2"], item["3"]];
          const correctAnswer = item.answer - 1; // 正しい選択肢のインデックス

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

        // 採点ボタンのクリックイベント
        submitBtn.addEventListener("click", (e) => {
          e.preventDefault();
          resultArea.style.display = "block"; // 結果表示エリアを表示

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

              if (ai === correct) label.classList.add("correct-answer");
              if (ai == parseInt(selected)) {
                if (ai === correct) score++;
                else label.classList.add("incorrect-answer");
              } else if (selected === "") {
                label.classList.add("not-selected");
              }
            });

            resultArea.innerHTML += `
              <p>問${i + 1}：${parseInt(selected) === correct ? "✅ 正解" : "❌ 不正解"}</p>
            `;
          });

          // 正答率表示
          const rate = ((score / total) * 100).toFixed(1);
          resultArea.innerHTML += `<p>正答率：${rate}% (${score}/${total})</p>`;

          submitBtn.style.display = "none"; // 採点ボタンを非表示
          homeBtn.style.display = "block"; // ホームへ戻るボタンを表示

          // 全問正解の場合、進行状況を完了に更新
          if (score === total) {
            setProgress(chapterId, sectionId, "completed");
          }
          else {
            setProgress(chapterId, sectionId, "in-progress")
          }
        });

        // ホームに戻るボタンのクリックイベント
        homeBtn.addEventListener("click", () => {
          location.href = "home.html";
        });
      }
    });
  })
  .catch(err => {
    console.error("CSVの読み込みに失敗しました:", err.message);
    console.error(err.stack); // スタックトレースを出力
    window.location.href = "home.html"; // エラー時にホームに戻る
  });

// ローカルストレージに進行状況を保存
function setProgress(chapterId, sectionId, status) {
  const progress = JSON.parse(localStorage.getItem("progress")) || {};
  if (!progress[chapterId]) progress[chapterId] = {};
  progress[chapterId][sectionId] = status;
  localStorage.setItem("progress", JSON.stringify(progress));
}