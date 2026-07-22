// 工具清單：新增工具時只改這裡，側邊欄與 /tools/ 首頁會一起更新
const TOOLS = [
  { href: 'mermaid.html', name: 'Mermaid 即時預覽', desc: '邊寫邊看流程圖／時序圖／ER 圖，可縮放與匯出 SVG、PNG。' },
];

const here = location.pathname.split('/').pop() || 'index.html';
const rail = document.createElement('aside');
rail.className = 'rail';
rail.innerHTML = `
  <a class="brand" href="./">🧰 Dev Tools</a>
  <nav>${TOOLS.map(t =>
    `<a href="./${t.href}"${t.href === here ? ' class="active" aria-current="page"' : ''}>${t.name}</a>`
  ).join('')}</nav>
  <a class="home" href="../">← 回首頁</a>`;
document.body.insertBefore(rail, document.body.firstChild);

const list = document.getElementById('tool-list');
if (list) list.innerHTML = TOOLS.map(t =>
  `<li><a href="./${t.href}">${t.name}</a><div class="desc">${t.desc}</div></li>`
).join('');
