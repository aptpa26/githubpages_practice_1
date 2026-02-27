// js/home.js
fetch('chapters.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('chapters');

    data.forEach(chapter => {
      const card = document.createElement('a');
      card.href = `chapter.html?id=${chapter.id}`;
      card.className = `card ${chapter.status}`;

      card.innerHTML = `
        <div class="title">${chapter.title}</div>
        <div class="status-badge">${getStatusText(chapter.status)}</div>
        <div class="status-bar"></div>
      `;

      container.appendChild(card);
    });
  });

function getStatusText(status) {
  switch(status) {
    case 'completed': return '完了';
    case 'in-progress': return '進行中';
    default: return '未履修';
  }
}