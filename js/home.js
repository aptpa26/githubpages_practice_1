/* ----------------------------
   データ取得＆カード生成
---------------------------- */
fetch('chapters.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('chapters');

    // ローカルストレージからユーザー進捗を取得
    const saved = localStorage.getItem("chapters");
    const userProgress = saved ? JSON.parse(saved) : {};

    data.forEach(chapter => {
      // ローカルストレージに保存があれば優先
      if(userProgress[chapter.id]) {
        chapter.status = userProgress[chapter.id];
      }

      const card = document.createElement('div');
      card.className = `card ${chapter.status}`;

      card.innerHTML = `
        <div class="title">${chapter.title}</div>
        <div class="status-badge">${getStatusText(chapter.status)}</div>
        <div class="status-bar"></div>
      `;

      // クリックで in-progress に更新
      card.addEventListener('click', () => {
        markInProgress(chapter.id, card);
      });

      // クリックでチャプターに飛ぶ場合
      card.addEventListener('click', () => {
        window.location.href = `chapter.html?id=${chapter.id}`;
      });

      container.appendChild(card);
    });
  });

/* ----------------------------
   ステータス文字表示
---------------------------- */
function getStatusText(status) {
  switch(status) {
    case 'completed': return '完了';
    case 'in-progress': return '進行中';
    default: return '未履修';
  }
}

/* ----------------------------
   in-progress 更新
---------------------------- */
function markInProgress(id, card) {
  const saved = localStorage.getItem("chapters");
  const progress = saved ? JSON.parse(saved) : {};

  // 完了済みなら変更しない
  if(progress[id] === "completed") return;

  progress[id] = "in-progress";
  localStorage.setItem("chapters", JSON.stringify(progress));

  // カードの見た目更新
  card.classList.remove('not-started');
  card.classList.add('in-progress');
  card.querySelector('.status-badge').textContent = "進行中";
}