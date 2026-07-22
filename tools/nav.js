// 工具清單：新增工具時只改這裡，側邊欄與 /tools/ 首頁會一起更新
const TOOLS = [
  { href: 'mermaid.html', name: 'Mermaid 即時預覽', desc: '邊寫邊看流程圖／時序圖／ER 圖，可縮放與匯出 SVG、PNG。' },
];

const here = location.pathname.split('/').pop() || 'index.html';
const rail = document.createElement('aside');
rail.className = 'rail';
rail.innerHTML = `
  <div class="head">
    <a class="brand" href="./">🧰 Dev Tools</a>
    <button class="toggle" title="收合側邊欄" aria-label="收合側邊欄">«</button>
  </div>
  <nav>${TOOLS.map(t =>
    `<a href="./${t.href}"${t.href === here ? ' class="active" aria-current="page"' : ''} title="${t.name}">${t.name}</a>`
  ).join('')}</nav>
  <a class="home" href="../">← 回首頁</a>`;
document.body.insertBefore(rail, document.body.firstChild);

const toggle = rail.querySelector('.toggle');
function setCollapsed(on) {
  document.body.classList.toggle('rail-collapsed', on);
  toggle.textContent = on ? '»' : '«';
  toggle.title = toggle.ariaLabel = on ? '展開側邊欄' : '收合側邊欄';
  localStorage.setItem('tools.rail', on ? '1' : '0');
  dispatchEvent(new Event('resize')); // 讓工具重新量寬度（例如 Mermaid 的自動縮放）
}
setCollapsed(localStorage.getItem('tools.rail') === '1');
toggle.addEventListener('click', () => setCollapsed(!document.body.classList.contains('rail-collapsed')));

const list = document.getElementById('tool-list');
if (list) list.innerHTML = TOOLS.map(t =>
  `<li><a href="./${t.href}">${t.name}</a><div class="desc">${t.desc}</div></li>`
).join('');
