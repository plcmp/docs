import { readFile, writeFile } from 'node:fs/promises';

// Копируем только переменные: глобальные body/preloader-стили NFJS относятся к оболочке приложения.
const source = new URL('../../nf-front-pl/static/theme.css', import.meta.url);
const target = new URL('../assets/nf-front-pl-tokens.css', import.meta.url);
const css = await readFile(source, 'utf8');
const root = css.match(/:root\s*\{[^}]*\}/)?.[0];
if (!root) throw new Error('В теме nf-front-pl не найден блок :root');
const result = `/* Источник: packages/nf-front-pl/static/theme.css. Обновление: node scripts/sync-theme.mjs */\n${root}\n`;
if (process.argv.includes('--check')) {
  if (await readFile(target, 'utf8') !== result) {
    throw new Error('Переменные документации расходятся с nf-front-pl. Запусти scripts/sync-theme.mjs.');
  }
  console.log('Переменные темы совпадают с nf-front-pl');
} else {
  await writeFile(target, result);
  console.log('Обновлён assets/nf-front-pl-tokens.css');
}
