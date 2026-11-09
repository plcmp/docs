function redirectDocsRoutes() {
  // Старые ссылки открывают тот же материал по новому адресу, включая якорь заголовка.
  let target = window.location.hash.replace(/^#\/integration(?=\/|\?|$)/, '#/nfjs');
  const path = target.slice(1).split('?')[0];
  if (/^\/nfjs\/?$/.test(path)) {
    target = target.replace(/^#\/nfjs\/?(?=\?|$)/, '#/nfjs/forms');
  }
  if (/^\/components(?:\/(?:README(?:\.md)?)?)?\/?$/i.test(path)) {
    target = '#/components/pl-button';
  }
  const componentSections = {
    '/components/table/pl-table-column': '/components/pl-table?id=pl-table-column',
    '/components/pl-combobox-list': '/components/pl-combobox?id=pl-combobox-list',
    '/components/pl-radio': '/components/pl-radio-group?id=pl-radio',
    '/components/pl-radio-button': '/components/pl-radio-group?id=pl-radio-button',
    '/components/pl-tab': '/components/pl-tabpanel?id=pl-tab',
    '/components/pl-tooltip-target': '/components/pl-tooltip?id=pl-tooltip-target',
    '/components/pl-datetime-month-selector': '/components/pl-calendar?id=pl-datetime-month-selector',
    '/components/pl-datetime-year-selector': '/components/pl-calendar?id=pl-datetime-year-selector'
  };
  if (componentSections[path]) target = `#${componentSections[path]}`;
  if (target !== window.location.hash) {
    window.location.replace(target);
  }
}

redirectDocsRoutes();
window.addEventListener('hashchange', redirectDocsRoutes);

window.$docsify = {
  name: 'Polylib',
  nameLink: '#/',
  logo: './images/logo.svg',
  homepage: 'README.md',
  routerMode: 'hash',
  skipLink: 'Перейти к содержимому',
  // Одиночные / и \ должны вводиться в полях демо, в том числе внутри Shadow DOM.
  keyBindings: { toggleSidebar: { bindings: [] } },
  loadSidebar: true,
  loadNavbar: true,
  collapsibleSidebarGroups: true,
  collapseSidebarGroups: false,
  alias: {
    '/nfjs/(?:.*/)?_sidebar.md': '/nfjs/_sidebar.md',
    '/components/(?:.*/)?_sidebar.md': '/components/_sidebar.md',
    '/.*/_sidebar.md': '/_sidebar.md',
    '/.*/_navbar.md': '/_navbar.md'
  },
  auto2top: true,
  subMaxLevel: 2,
  maxLevel: 3,
  notFoundPage: true,
  executeScript: false,
  themeColor: '#31756f',
  search: {
    paths: [
      '/', '/guide/', '/guide/getting-started', '/guide/mental-model',
      '/guide/reactivity', '/guide/bindings', '/guide/object-bindings',
      '/guide/templates', '/guide/events', '/guide/lifecycle', '/guide/edge-cases',
      '/guide/styles', '/guide/style-guide',
      '/nfjs/forms', '/nfjs/subforms', '/nfjs/access',
      '/nfjs/validation', '/nfjs/data', '/nfjs/rest',
      '/nfjs/server-endpoints', '/nfjs/actions', '/nfjs/datasets',
      '/nfjs/change-tracking', '/nfjs/partial-save', '/nfjs/nested-changes',
      '/components/pl-button',
      '/components/pl-icon-button',
      '/components/pl-input',
      '/components/pl-textarea',
      '/components/pl-checkbox',
      '/components/pl-combobox',
      '/components/pl-radio-group',
      '/components/pl-datetime',
      '/components/pl-calendar',
      '/components/pl-time-picker',
      '/components/pl-dropdown',
      '/components/pl-popover',
      '/components/pl-tooltip',
      '/components/pl-icon',
      '/components/pl-iconset',
      '/components/pl-flex-layout',
      '/components/pl-labeled-container',
      '/components/pl-tabpanel',
      '/components/pl-data-observer',
      '/components/pl-virtual-scroll',
      '/components/pl-table',
      '/components/table/selection',
      '/components/table/multi-select',
      '/components/table/sorting',
      '/components/table/filtering',
      '/components/table/filtering-toolbar',
      '/components/table/formatting',
      '/components/table/cell-templates',
      '/components/table/styling',
      '/components/table/editing',
      '/components/table/tree',
      '/components/table/tooltips',
      '/components/table/fixed-columns',
      '/components/table/resizing',
      '/components/table/column-visibility',
      '/components/table/header',
      '/components/table/alignment',
      '/components/table/footer',
      '/components/table/slots',
      '/components/table/growing',
      '/components/table/fixed-height',
      '/components/table/loading',
      '/components/table/variable-height',
      '/components/table/custom-row'
    ],
    depth: 3,
    maxAge: 86400000,
    namespace: `polylib-docs-${window.location.pathname}-a6844a10c3`,
    insertAfter: '.app-name',
    placeholder: 'Поиск по документации',
    noData: 'Ничего не найдено',
    resultSource: 'page',
    keyBindings: ['meta+k', 'ctrl+k']
  },
  copyCode: {
    buttonText: 'Копировать',
    errorText: 'Не удалось скопировать',
    successText: 'Скопировано'
  },
  pagination: {
    previousText: 'Назад',
    nextText: 'Дальше',
    crossChapter: true,
    crossChapterText: false
  },
  plugins: [function docsPage(hook, vm) {
    let previousPath;
    let previousSection;
    const nestedGroupStates = new Map();
    hook.beforeEach(function (markdown) {
      document.querySelectorAll('.sidebar-nav li.group li.group').forEach((group) => {
        const key = group.querySelector('ul a')?.hash;
        if (key) nestedGroupStates.set(key, group.classList.contains('collapse'));
      });
      return markdown;
    });
    const currentSection = () => vm.route.path.startsWith('/nfjs/') ? '/nfjs/'
      : vm.route.path.startsWith('/components/') ? '/components/' : '/guide/';
    function markCurrentSection() {
      document.querySelectorAll('.app-nav a').forEach((link) => {
        const selected = link.hash.slice(1).startsWith(currentSection());
        link.closest('li')?.classList.toggle('active', selected);
        if (selected) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }
    hook.mounted(function () {
      const navbar = document.querySelector('.app-nav');
      // Navbar может загрузиться позже страницы, поэтому отмечаем раздел и после её отрисовки.
      if (navbar) new MutationObserver(markCurrentSection).observe(navbar, { childList: true, subtree: true });
      const status = document.querySelector('.search .results-status');
      if (status) {
        new MutationObserver(() => {
          const count = status.textContent.match(/^Found (\d+) results$/)?.[1];
          if (count) status.textContent = `Найдено: ${count}`;
        }).observe(status, { childList: true });
      }
      document.querySelector('.search input')?.setAttribute('aria-label', 'Поиск по документации');
      document.querySelector('.search input')?.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
      document.querySelector('.search .kbd-group kbd:first-child')?.remove();
      document.querySelector('.search .kbd-group kbd')?.setAttribute('title', 'Поиск: Ctrl+K или ⌘K');
      document.querySelector('.sidebar-toggle-button')?.removeAttribute('aria-keyshortcuts');
    });
    hook.doneEach(function () {
      const title = document.querySelector('.markdown-section h1')?.textContent;
      document.title = title ? `${title} · Polylib` : 'Polylib — документация';
      document.querySelector('.sidebar-toggle')?.setAttribute('aria-label', 'Открыть или закрыть меню');
      document.querySelector('.sidebar-toggle')?.setAttribute('title', 'Открыть или закрыть меню');
      document.querySelector('.sidebar-toggle-button')?.setAttribute('aria-label', 'Открыть или закрыть меню');
      document.querySelector('.sidebar-nav')?.setAttribute('aria-label', 'Разделы документации');
      const clearSearch = document.querySelector('.search .clear-button');
      if (clearSearch) {
        clearSearch.title = 'Очистить поиск';
        clearSearch.setAttribute('aria-label', 'Очистить поиск');
      }
      const section = currentSection();
      // Docsify добавляет переключатели только верхним группам; вложенные используют те же обработчики.
      document.querySelectorAll('.sidebar-nav li.group li.group').forEach((group) => {
        const title = group.querySelector(':scope > p');
        if (!title) return;
        const collapsed = nestedGroupStates.get(group.querySelector('ul a')?.hash) ?? false;
        group.classList.toggle('collapse', collapsed);
        title.classList.add('group-title', 'group-toggle');
        title.setAttribute('role', 'button');
        title.setAttribute('tabindex', '0');
        title.setAttribute('aria-expanded', String(!collapsed));
      });
      if (previousSection !== section) {
        if (previousSection) clearSearch?.click();
        document.querySelectorAll('.sidebar-nav > ul > li.group').forEach((group) => {
          group.classList.remove('collapse');
          group.querySelector(':scope > .group-toggle')?.setAttribute('aria-expanded', 'true');
        });
        previousSection = section;
      }
      // Открываем группу выбранной страницы, сохраняя остальные группы в состоянии читателя.
      if (previousPath !== vm.route.path) {
        if (previousPath && window.matchMedia('(max-width: 640px)').matches
          && document.querySelector('.sidebar.show')) {
          document.querySelector('.sidebar-toggle-button')?.click();
        }
        const activeLink = document.querySelector('.sidebar-nav li[aria-current="page"] > a');
        let group = activeLink?.closest('li.group')
          || (vm.route.path === '/' ? document.querySelector('.sidebar-nav > ul > li.group') : null);
        while (group) {
          group.classList.remove('collapse');
          group.querySelector(':scope > .group-toggle')?.setAttribute('aria-expanded', 'true');
          group = group.parentElement?.closest('li.group');
        }
        previousPath = vm.route.path;
      }
      markCurrentSection();
      const main = document.querySelector('#main');
      if (main) main.tabIndex = -1;
      document.querySelectorAll('.markdown-section table').forEach((table) => {
        if (table.parentElement.classList.contains('docs-table-scroll')) return;
        const headers = Array.from(table.querySelectorAll('thead th'), (cell) => cell.textContent.trim());
        table.querySelectorAll('thead th').forEach((cell) => cell.setAttribute('scope', 'col'));
        if (headers.join('|') === 'Свойство|Тип|По умолчанию|Описание') {
          table.classList.add('docs-properties-table');
        }
        const scroll = document.createElement('div');
        scroll.className = 'docs-table-scroll';
        scroll.tabIndex = 0;
        scroll.setAttribute('role', 'region');
        scroll.setAttribute('aria-label', `Таблица: ${headers.filter(Boolean).join(', ')}`);
        table.before(scroll);
        scroll.append(table);
      });
      // Подпись остаётся частью Markdown; на странице каждый вариант получает собственную поверхность.
      document.querySelectorAll('.markdown-section p').forEach((label) => {
        const heading = label.querySelector(':scope > strong:only-child');
        const code = label.nextElementSibling;
        if (!heading || code?.tagName !== 'PRE') return;
        const text = heading.textContent.trim();
        if (!/^(Правильно|Неправильно)(?:$|:)/.test(text)) return;
        const example = document.createElement('section');
        example.className = `code-example ${text.startsWith('Неправильно') ? 'is-bad' : 'is-good'}`;
        example.setAttribute('aria-label', text);
        label.className = 'code-example-label';
        label.before(example);
        example.append(label, code);
      });
      const state = document.documentElement.dataset.demos;
      document.querySelectorAll('.demo-status').forEach((status) => {
        status.hidden = state === 'ready';
        status.textContent = state === 'error'
          ? 'Не удалось загрузить примеры с CDN. Проверь соединение и обнови страницу.'
          : 'Загружаем примеры…';
      });
    });
  }]
};
