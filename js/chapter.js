const params = new URLSearchParams(location.search);
const chapterId = params.get('id');

// 動画ID配列（例）
const videoIds = [
  "VIDEO_ID1",
  "VIDEO_ID2",
  // ...
];

document.getElementById('ytVideo').src = 
  "https://www.youtube.com/embed/" + videoIds[chapterId-1];

// クイズデータ（例）
const quizzes = [
  [
    {q:"質問1?", a:["答1","答2"], correct:0},
    // ...
  ],
  // ...
];

const quizSection = document.getElementById('quizSection');

document.getElementById('startQuiz').addEventListener('click', () => {
  quizSection.innerHTML = "";
  let score = 0;
  quizzes[chapterId-1].forEach((item, i) => {
    const div = document.createElement('div');
    div.innerHTML = `<p>${item.q}</p>`;
    item.a.forEach((ans, ai) => {
      const btn = document.createElement('button');
      btn.textContent = ans;
      btn.onclick = () => {
        if(ai === item.correct) score++;
        if(i === quizzes[chapterId-1].length -1){
          alert("正答率: "+((score/quizzes[chapterId-1].length)*100)+"%");
        }
      };
      div.appendChild(btn);
    });
    quizSection.appendChild(div);
  });
});