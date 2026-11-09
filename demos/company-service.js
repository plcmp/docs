/** Учебный сервис Demo-company. Хранит данные только в памяти текущего примера. */
const sessions = new Map();
let nextSession = 1;
const copy = (value) => JSON.parse(JSON.stringify(value));

/** Создаёт отдельный набор данных и адресов для экземпляра демо. */
export function createCompanySession() {
  const id = String(nextSession++);
  const root = `/docs-demo-company/${id}`;
  const employees = [
    { id: '101', lastname: 'Соколова', firstname: 'Анна', patronymic: null, gender: 2, birthdate: '1992-04-18' },
    { id: '102', lastname: 'Орлов', firstname: 'Михаил', patronymic: null, gender: 1, birthdate: '1988-09-07' }
  ];
  sessions.set(id, {
    employees, allowed: true, failNext: false, lastRequest: null, nextId: 1000,
    contacts: {
      '101': [{ id: '201', employee_id: '101', contact_type: 2, contact: 'anna@example.test' }],
      '102': [{ id: '202', employee_id: '102', contact_type: 2, contact: 'mikhail@example.test' }]
    },
    cards: [
      { id: '301', employee_id: '101', date_begin: '2024-02-01', date_end: '2025-08-31', position: 1, rate: '1', inoperabilities: [
        { id: '401', card_id: '301', type: 2, other_type_description: 'Иные причины', date_begin: '2025-06-10', date_end: '2025-06-11' }
      ] },
      { id: '302', employee_id: '101', date_begin: '2025-09-01', date_end: null, position: 2, rate: '0.5', inoperabilities: [
        { id: '402', card_id: '302', type: 2, other_type_description: 'Иные причины', date_begin: '2025-10-15', date_end: '2025-10-16' }
      ] }
    ]
  });
  return {
    id,
    listEndpoint: `${root}/employee/list`, getEndpoint: `${root}/employee/get`,
    updateEndpoint: `${root}/employee/update`, contactsEndpoint: `${root}/employee/contactsList`,
    contactsSaveEndpoint: `${root}/contacts/save`, cardsEndpoint: `${root}/cards/list`,
    cardSaveEndpoint: `${root}/cards/save`, accessEndpoint: `${root}/access`
  };
}

export function setDemoPermission(session, allowed) {
  sessions.get(session.id).allowed = allowed;
}

export function failNextRequest(session) {
  sessions.get(session.id).failNext = true;
}

export function lastRequest(session) {
  return copy(sessions.get(session.id).lastRequest);
}

/** Применяет согласованный журнал add/upd/del к учебной коллекции. */
function applyJournal(rows, changes, owner, state) {
  for (const row of changes.del ?? []) {
    const index = rows.findIndex((item) => item.id === row.id);
    if (index < 0) throw new Error('Запись для удаления не найдена');
    rows.splice(index, 1);
  }
  for (const row of changes.upd ?? []) {
    const index = rows.findIndex((item) => item.id === row.id);
    if (index < 0) throw new Error('Запись для изменения не найдена');
    rows[index] = { ...row, ...owner };
  }
  for (const row of changes.add ?? []) {
    rows.push({ ...row, ...owner, id: String(state.nextId++) });
  }
}

/** Заменяет RequestServer только в import map документации; сетевых запросов здесь нет. */
export async function requestData(url, params = {}) {
  const match = url.match(/^\/docs-demo-company\/(\d+)\/(.+)$/);
  if (!match || !sessions.has(match[1])) throw new Error('Неизвестный адрес учебного сервиса');
  const state = sessions.get(match[1]);
  const route = match[2];
  const body = params.body ? JSON.parse(params.body) : {};
  state.lastRequest = { method: params.method, route, body };
  await new Promise((resolve, reject) => {
    const signal = params.signal;
    const abort = () => { clearTimeout(timer); reject(new DOMException('Запрос отменён', 'AbortError')); };
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, 350);
    if (signal?.aborted) abort();
    else signal?.addEventListener('abort', abort, { once: true });
  });
  const args = body.args;
  let result;
  try {
    if (state.failNext) {
      state.failNext = false;
      throw new Error('Учебная ошибка: изменения не сохранены. Можно повторить запрос.');
    }
    if (route === 'access') {
      result = { privs: { company: { employee: { read: true, upd: state.allowed } } } };
    } else if (route === 'employee/list') {
      result = { data: state.employees.map((employee) => ({ ...employee, fio: `${employee.lastname} ${employee.firstname}` })) };
    } else if (route === 'employee/get') {
      const employee = state.employees.find((item) => item.id === args.employeeId);
      if (!employee) throw new Error('Сотрудник не найден');
      result = { data: employee };
    } else if (route === 'employee/contactsList') {
      result = { data: state.contacts[args.employeeId] };
    } else if (route === 'cards/list') {
      result = { data: state.cards.filter((card) => card.employee_id === args.employeeId) };
    } else {
      if (!state.allowed) throw new Error('Нет права изменять данные сотрудника');
      if (route === 'employee/update') {
        const index = state.employees.findIndex((item) => item.id === args.id);
        if (index < 0) throw new Error('Сотрудник не найден');
        state.employees[index] = args;
        result = { data: { id: args.id } };
      } else if (route === 'contacts/save') {
        const rows = copy(state.contacts[args.employeeId]);
        applyJournal(rows, args.contacts, { employee_id: args.employeeId }, state);
        state.contacts[args.employeeId] = rows;
        result = { data: { contacts: rows } };
      } else if (route === 'cards/save') {
        const index = state.cards.findIndex((card) => card.id === args.card.id && card.employee_id === args.employeeId);
        if (index < 0) throw new Error('Личная карточка не найдена');
        const { inoperabilities, ...fields } = args.card;
        const rows = copy(state.cards[index].inoperabilities);
        const journal = { add: [], upd: [], del: [] };
        for (const { $action, ...row } of inoperabilities) {
          if (!Object.hasOwn(journal, $action)) throw new Error('Неизвестная операция периода');
          journal[$action].push(row);
        }
        applyJournal(rows, journal, { card_id: fields.id }, state);
        state.cards[index] = { ...fields, inoperabilities: rows };
        result = { data: { card: state.cards[index] } };
      } else throw new Error('Неизвестная операция учебного сервиса');
    }
  } catch (error) {
    if (route === 'access') throw error;
    result = { error: error.message };
  }
  return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
}
