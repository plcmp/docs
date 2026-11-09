/** Регистрирует опубликованные компоненты один раз, независимо от переходов Docsify. */
async function loadDemos() {
  await import('./iconset.js');
  await Promise.all([
    import('@plcmp/pl-button'),
    import('@plcmp/pl-input'),
    import('@plcmp/pl-icon-button'),
    import('../demos/counter.js'),
    import('../demos/checkbox.js'),
    import('../demos/textarea.js'),
    import('../demos/flex-layout.js'),
    import('../demos/bindings.js'),
    import('../demos/object-bindings.js'),
    import('../demos/templates.js'),
    import('../demos/data-observer.js'),
    import('../demos/company-data.js'),
    import('../demos/company-access.js'),
    import('../demos/company-editor.js'),
    import('../demos/company-cards.js')
  ]);
}

try {
  await loadDemos();
  document.documentElement.dataset.demos = 'ready';
  document.querySelectorAll('.demo-status').forEach((status) => { status.hidden = true; });
} catch (error) {
  document.documentElement.dataset.demos = 'error';
  document.querySelectorAll('.demo-status').forEach((status) => {
    status.hidden = false;
    status.textContent = 'Не удалось загрузить примеры с CDN. Проверь соединение и обнови страницу.';
  });
  console.error('Не удалось загрузить демо Polylib', error);
}
