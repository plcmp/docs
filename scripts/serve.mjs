import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || 4173);
const types = { '.html': 'text/html', '.md': 'text/markdown', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

// Раздаём только файлы документации; скрытые каталоги, включая .git, недоступны.
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!path.startsWith(root + sep) || pathname.split('/').some(part => part.startsWith('.')) || !types[extname(path)]) {
      response.writeHead(404).end('Страница не найдена');
      return;
    }
    const data = await readFile(path);
    response.writeHead(200, { 'Content-Type': `${types[extname(path)]}; charset=utf-8`, 'Cache-Control': 'no-cache' });
    response.end(data);
  } catch {
    response.writeHead(404).end('Страница не найдена');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Документация: http://127.0.0.1:${port}`);
});
