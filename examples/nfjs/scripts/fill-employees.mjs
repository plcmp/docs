import { config } from '@nfjs/core';

const base = `http://127.0.0.1:${config.http_port}`;
const admin = config['@nfjs/migrate'].defaultDoInit;
const login = await fetch(`${base}/front/action/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ args: { login: admin.appAdminName, password: admin.appAdminPassword } })
});
const auth = await login.json();
if (!login.ok || auth.error || !auth.data) throw new Error('Не удалось войти в учебное приложение');
const cookie = login.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
async function execute(path, args = {}) {
  const response = await fetch(`${base}${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ args })
  });
  const result = await response.json();
  if (!response.ok || result.error) throw new Error(`Операция ${path} завершилась ошибкой`);
  return result.data;
}
const employees = [
  { lastname: 'Смирнова', firstname: 'Анна', gender: 2, birthdate: '1990-04-12' },
  { lastname: 'Орлов', firstname: 'Михаил', gender: 1, birthdate: '1988-11-02' },
  { lastname: 'Волкова', firstname: 'Елена', gender: 2, birthdate: '1992-06-18' },
  { lastname: 'Ким', firstname: 'Денис', gender: 1, birthdate: '1993-02-06' },
  { lastname: 'Кузнецова', firstname: 'Мария', gender: 2, birthdate: '1991-09-12' },
  { lastname: 'Петров', firstname: 'Олег', gender: 1, birthdate: '1985-04-19' }
];
const existing = await execute('/guide/employee/list');
let created = 0;
for (const employee of employees) {
  if (existing.some(row => row.lastname === employee.lastname && row.firstname === employee.firstname)) continue;
  await execute('/guide/employee/create', employee);
  created++;
}
console.log(`Добавлено сотрудников: ${created}`);
