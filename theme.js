// 深／淺色切換。各頁的 CSS 已備好 :root[data-theme] 覆寫，這裡只負責設值與那顆按鈕。
(function () {
  const KEY = 'theme';
  const root = document.documentElement;
  const system = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // 在 <head> 就先套用，避免重新整理時閃一下舊色
  let mode = localStorage.getItem(KEY);
  if (mode === 'dark' || mode === 'light') root.dataset.theme = mode;

  addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
      #theme-toggle {
        position: fixed; right: 20px; bottom: 20px; z-index: 50;
        width: 44px; height: 44px; border-radius: 999px;
        display: grid; place-items: center;
        font-size: 18px; line-height: 1; cursor: pointer;
        border: 1px solid var(--line, #ccc);
        background: var(--soft, #eee); color: var(--ink, #222);
        transition: background .15s, transform .08s;
      }
      #theme-toggle:hover { background: var(--line, #ddd); }
      #theme-toggle:active { transform: translateY(1px); }
      @media print { #theme-toggle { display: none; } }`;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    document.body.appendChild(btn);

    const current = () => root.dataset.theme || system();
    const paint = () => {
      const dark = current() === 'dark';
      btn.textContent = dark ? '☀' : '☾';
      btn.title = btn.ariaLabel = dark ? '切換為淺色' : '切換為深色';
    };
    btn.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem(KEY, next);
      paint();
      dispatchEvent(new CustomEvent('themechange', { detail: next }));
    });
    // 沒手動選過就跟著系統走
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!localStorage.getItem(KEY)) paint();
    });
    paint();
  });
})();
