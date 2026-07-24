// 中／英切換。兩種語言都直接寫在 HTML 裡、用 lang 屬性標記，這裡只負責設 data-lang、
// 換 <title> / description，以及那顆按鈕。沒有字典檔、沒有 build，文案就在它該在的位置。
// 這支必須放在 <head>（跟 theme.js 一樣），CSS 才會在第一次繪製前就生效，不會兩語言閃一下。
(function () {
  const KEY = 'lang';
  const root = document.documentElement;

  const style = document.createElement('style');
  style.textContent = `
    :root[data-lang="en"] [lang|="zh"] { display: none !important; }
    :root[data-lang="zh"] [lang="en"] { display: none !important; }
    #lang-toggle {
      position: fixed; right: 20px; bottom: 56px; z-index: 50;
      width: 3.4em; padding: 3px 0;
      font-family: var(--font-mono, ui-monospace, monospace);
      font-size: 13px; line-height: 1.5; text-align: center;
      border: 1px solid var(--line, #ccc); border-radius: 999px;
      background: var(--soft, #eee); color: var(--ink, #182129);
      cursor: pointer;
      transition: border-color .15s, color .15s;
    }
    #lang-toggle:hover { border-color: var(--accent, #A2571F); color: var(--accent, #A2571F); }
    #lang-toggle:focus-visible { outline: 2px solid var(--accent, #A2571F); outline-offset: 3px; }
    @media print { #lang-toggle { display: none; } }`;
  document.head.appendChild(style);

  function apply(l) {
    root.dataset.lang = l;
    root.lang = l === 'en' ? 'en' : 'zh-Hant';
    // data-en 元素直接換字：title、meta（換 content）與無法用 CSS 切換的 <option>。
    // og/twitter 不動——那是給爬蟲看的，爬蟲看不到這裡的切換。
    document.querySelectorAll('[data-en]').forEach(el => {
      const meta = el.tagName === 'META';
      if (el.dataset.zh === undefined) el.dataset.zh = meta ? el.content : el.textContent;
      const text = l === 'en' ? el.dataset.en : el.dataset.zh;
      if (meta) el.content = text; else el.textContent = text;
    });
  }

  const saved = localStorage.getItem(KEY);
  apply(saved === 'en' || saved === 'zh' ? saved
    : (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');

  addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.lang); // head 執行時 body 的 [data-en]（如 <option>）還沒解析，這裡補一次

    const btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.type = 'button';
    const paint = () => {
      const en = root.dataset.lang === 'en';
      btn.textContent = en ? '中文' : 'EN';
      btn.title = btn.ariaLabel = en ? '切換為中文' : 'Switch to English';
    };
    btn.addEventListener('click', () => {
      const next = root.dataset.lang === 'en' ? 'zh' : 'en';
      apply(next);
      localStorage.setItem(KEY, next);
      paint();
      dispatchEvent(new CustomEvent('langchange', { detail: next }));
    });
    paint();
    document.body.appendChild(btn);
  });
})();
