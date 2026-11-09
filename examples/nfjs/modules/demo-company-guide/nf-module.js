import { web } from '@nfjs/back';
import { api } from '@nfjs/core';
import { fileURLToPath } from 'node:url';
import { list, get, getGenerated, create, update, remove, save, contactsList } from './lib/employees.js';

const meta = {
  require: {
    after: ['@nfjs/front-pl'],
    before: ['@nfjs/back-dbfw']
  }
};
const menu = await api.loadJSON(fileURLToPath(new URL('./menu.json', import.meta.url)));
const msgs = await api.loadJSON(fileURLToPath(new URL('./msgs.json', import.meta.url)));

async function init() {
  const middleware = ['session', 'auth', 'json'];
  web.on('POST', '/guide/employee/list', { middleware }, list);
  web.on('POST', '/guide/employee/get', { middleware }, get);
  web.on('POST', '/guide/generated/employee/get', { middleware }, getGenerated);
  web.on('POST', '/guide/employee/create', { middleware }, create);
  web.on('POST', '/guide/employee/update', { middleware }, update);
  web.on('POST', '/guide/employee/delete', { middleware }, remove);
  web.on('POST', '/guide/employee/save', { middleware }, save);
  web.on('POST', '/guide/employee/contacts', { middleware }, contactsList);
}

export { meta, menu, msgs, init };
