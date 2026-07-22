// 深／淺色切換。各頁的 CSS 已備好 :root[data-theme] 覆寫，這裡只負責設值與那顆開關。
// 開關樣式改寫自 Uiverse.io by satyamchaudharydev（MIT）：
// https://github.com/uiverse-io/galaxy/blob/main/Toggle-switches/satyamchaudharydev_shy-earwig-18.html
// 調整：寫死的色值換成本站主題變數、加上 focus-visible 與 prefers-reduced-motion。
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
        --w: 3.4em; --h: 1.9em; --icon: 1.35em; --gap: 0.28em;
        position: fixed; right: 20px; bottom: 20px; z-index: 50;
        display: block; width: var(--w); height: var(--h);
        font-size: 13px;
      }
      #theme-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
      #theme-toggle .slider {
        position: absolute; inset: 0; cursor: pointer;
        border: 1px solid var(--line, #ccc);
        border-radius: 999px;
        background: var(--soft, #eee);
        transition: background .4s, border-color .4s;
      }
      #theme-toggle .slider::before {
        content: ""; position: absolute;
        width: var(--icon); height: var(--icon);
        left: var(--gap); top: 50%; transform: translateY(-50%);
        border-radius: 999px;
        background: var(--accent, #A2571F);
        transition: left .4s, background .4s, box-shadow .4s;
      }
      #theme-toggle input:checked + .slider { background: var(--bg, #0F1317); }
      #theme-toggle input:checked + .slider::before {
        left: calc(100% - (var(--icon) + var(--gap)));
        background: var(--ink, #E6EBEF);
        /* 用軌道色的 inset 陰影往左上偏，挖出月牙 */
        box-shadow: inset -0.42em -0.2em 0 0 var(--bg, #0F1317);
      }
      #theme-toggle input:focus-visible + .slider {
        outline: 2px solid var(--accent, #A2571F); outline-offset: 3px;
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-toggle .slider, #theme-toggle .slider::before { transition: none; }
      }
      @media print { #theme-toggle { display: none; } }`;
    document.head.appendChild(style);

    const label = document.createElement('label');
    label.id = 'theme-toggle';
    label.innerHTML = '<input type="checkbox"><span class="slider"></span>';
    document.body.appendChild(label);
    const input = label.querySelector('input');

    const current = () => root.dataset.theme || system();
    const paint = () => {
      const dark = current() === 'dark';
      input.checked = dark;
      input.ariaLabel = label.title = dark ? '切換為淺色' : '切換為深色';
    };
    input.addEventListener('change', () => {
      const next = input.checked ? 'dark' : 'light';
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
