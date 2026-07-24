// 工具清單：新增工具時只改這裡，側邊欄與 /tools/ 首頁會一起更新
const TOOLS = [
  { href: 'mermaid.html',
    name: 'Mermaid 即時預覽', name_en: 'Mermaid live preview',
    desc: '邊寫邊看流程圖／時序圖／ER 圖，可縮放與匯出 SVG、PNG。',
    desc_en: 'Write and preview flowcharts / sequence / ER diagrams, zoom and export SVG & PNG.' },
  { href: 'draw.html',
    name: '流程圖 → Mermaid', name_en: 'Flowchart → Mermaid',
    desc: '用拖拉的方式畫流程圖，直接產生 Mermaid 語法與 Markdown 區塊。',
    desc_en: 'Draw a flowchart by dragging, and get Mermaid syntax and a Markdown block.' },
];

const T = {
  zh: { brand: '🧰 Dev Tools', home: '← 回首頁', collapse: '收合側邊欄', expand: '展開側邊欄' },
  en: { brand: '🧰 Dev Tools', home: '← Home', collapse: 'Collapse sidebar', expand: 'Expand sidebar' },
};
const lang = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'zh';
const nameOf = t => lang() === 'en' ? t.name_en : t.name;
const descOf = t => lang() === 'en' ? t.desc_en : t.desc;

const here = location.pathname.split('/').pop() || 'index.html';
const rail = document.createElement('aside');
rail.className = 'rail';
document.body.insertBefore(rail, document.body.firstChild);

function renderRail() {
  const t = T[lang()];
  rail.innerHTML = `
    <div class="head">
      <a class="brand" href="./">${t.brand}</a>
      <button class="toggle" title="${t.collapse}" aria-label="${t.collapse}">«</button>
    </div>
    <nav>${TOOLS.map(tool =>
      `<a href="./${tool.href}"${tool.href === here ? ' class="active" aria-current="page"' : ''} title="${nameOf(tool)}">${nameOf(tool)}</a>`
    ).join('')}</nav>
    <a class="home" href="../">${t.home}</a>`;
  wireToggle();
}

function wireToggle() {
  const toggle = rail.querySelector('.toggle');
  const t = T[lang()];
  const setCollapsed = on => {
    document.body.classList.toggle('rail-collapsed', on);
    toggle.textContent = on ? '»' : '«';
    toggle.title = toggle.ariaLabel = on ? t.expand : t.collapse;
    localStorage.setItem('tools.rail', on ? '1' : '0');
    dispatchEvent(new Event('resize')); // 讓工具重新量寬度（例如 Mermaid 的自動縮放）
  };
  setCollapsed(localStorage.getItem('tools.rail') === '1');
  toggle.addEventListener('click', () => setCollapsed(!document.body.classList.contains('rail-collapsed')));
}

function renderList() {
  const list = document.getElementById('tool-list');
  if (list) list.innerHTML = TOOLS.map(t =>
    `<li><a href="./${t.href}">${nameOf(t)}</a><div class="desc">${descOf(t)}</div></li>`
  ).join('');
}

renderRail();
renderList();
addEventListener('langchange', () => { renderRail(); renderList(); });
