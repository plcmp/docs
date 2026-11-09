function redirectRemovedCatalog() {
  const path = window.location.hash.slice(1).split('?')[0];
  if (/^\/components(?:\/(?:README(?:\.md)?)?)?\/?$/i.test(path)) {
    window.location.replace('#/components/pl-button');
  }
}

redirectRemovedCatalog();
window.addEventListener('hashchange', redirectRemovedCatalog);

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
    '/integration/(?:.*/)?_sidebar.md': '/integration/_sidebar.md',
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
      '/integration/forms', '/integration/subforms', '/integration/access',
      '/integration/validation', '/integration/data', '/integration/rest',
      '/integration/server-endpoints', '/integration/actions', '/integration/datasets',
      '/integration/change-tracking', '/integration/partial-save', '/integration/nested-changes',
      '/components/pl-button', '/components/pl-icon-button', '/components/pl-input',
      '/components/pl-checkbox', '/components/pl-textarea', '/components/pl-flex-layout',
      '/components/pl-labeled-container', '/components/pl-data-observer'
    ],
    depth: 3,
    maxAge: 86400000,
    namespace: `polylib-docs-${window.location.pathname}-sections`,
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
    hook.mounted(function () {
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
      const section = vm.route.path.startsWith('/integration/') ? '/integration/'
        : vm.route.path.startsWith('/components/') ? '/components/' : '/guide/';
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
        const group = activeLink?.closest('.sidebar-nav > ul > li.group')
          || (vm.route.path === '/' && document.querySelector('.sidebar-nav > ul > li.group'));
        group?.classList.remove('collapse');
        group?.querySelector(':scope > .group-toggle')?.setAttribute('aria-expanded', 'true');
        previousPath = vm.route.path;
      }
      document.querySelectorAll('.app-nav a').forEach((link) => {
        const selected = link.hash.slice(1).startsWith(section);
        link.closest('li')?.classList.toggle('active', selected);
        if (selected) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
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
