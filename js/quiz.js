const params = new URLSearchParams(location.search);
const chapterId = params.get("id");

// DOM
const quizForm = document.getElementById("quizForm");
const submitBtn = document.getElementById("submitBtn");
const resultArea = document.getElementById("result");
const homeBtn = document.getElementById("homeBtn");

// JSON からクイズを読み込む
fetch("quizzes.json")
  .then(res => res.json())
  .then(allQuizzes => {
    const quizzes = allQuizzes[chapterId - 1];

    // クイズ表示
    quizzes.forEach((item, i) => {
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

    // 採点
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resultArea.style.display = "block";

      let score = 0;
      let total = quizzes.length;

      resultArea.innerHTML = "<h3>採点結果</h3>";

      quizzes.forEach((item, i) => {
        const selected = quizForm[`q${i}`].value;
        const correct = item.correct;

        const container = quizForm.querySelector(`div.quiz-question:nth-child(${i+1})`);
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

      // ✅ 全問正解なら localStorage に保存
      if(score === total) {
        const saved = localStorage.getItem("chapters");
        const progress = saved ? JSON.parse(saved) : {};
        progress[chapterId] = "completed";
        localStorage.setItem("chapters", JSON.stringify(progress));
      }
    });

    // ホームへ
    homeBtn.addEventListener("click", () => {
      location.href = "home.html";
    });
  });