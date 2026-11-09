import { dbapi } from '@nfjs/back';
import { api } from '@nfjs/core';

export async function list(context) {
  const result = await dbapi.query(`
    select id, concat_ws(' ', lastname, firstname, patronymic) as fio,
           firstname, lastname, patronymic, gender, birthdate
      from company.v4employee`, {}, { context }, context.body.control);
  context.send(result);
}

export async function get(context) {
  const result = await dbapi.query(`
    select id, firstname, lastname, patronymic, gender, birthdate
      from company.v4employee where id = :employeeId`,
  { employeeId: context.body.args.employeeId }, { context });
  context.send({ data: result.data[0] });
}

export async function create(context) {
  try {
    const result = await dbapi.broker('company.employee.add', context.body.args, { context });
    context.send({ data: result.data });
  } catch (error) {
    context.send(api.nfError(error).json());
  }
}

export async function getGenerated(context) {
  const result = await dbapi.query(`
    select id, firstname, lastname, patronymic, gender, birthdate, note
      from company.v4employee where id = :recordId`,
  { recordId: context.body.args.recordId }, { context, returnFirst: true });
  context.send(result);
}

export async function update(context) {
  try {
    const result = await dbapi.broker('company.employee.upd', context.body.args, { context });
    context.send({ data: result.data });
  } catch (error) {
    context.send(api.nfError(error).json());
  }
}

export async function remove(context) {
  const result = await dbapi.broker('company.employee.del', { id: context.body.args.id }, { context });
  context.send({ data: result.data });
}

export async function contactsList(context) {
  const result = await dbapi.query(`
    select id, employee_id, contact_type, contact
      from company.v4employee_contact where employee_id = :employeeId`,
  { employeeId: context.body.args.employeeId }, { context });
  context.send(result);
}

export async function save(context) {
  const { employee, contacts = {} } = context.body.args;
  const connect = await dbapi.getConnect(context);
  try {
    await connect.begin();
    const result = await connect.broker(
      employee.id ? 'company.employee.upd' : 'company.employee.add', employee
    );
    const id = employee.id ?? result.data.id;
    for (const row of contacts.del ?? []) {
      await connect.broker('company.employee_contact.del', { id: row.id });
    }
    for (const row of contacts.upd ?? []) {
      await connect.broker('company.employee_contact.upd', row);
    }
    for (const row of contacts.add ?? []) {
      await connect.broker('company.employee_contact.add', { ...row, employee_id: id });
    }
    await connect.commit();
    context.send({ data: { id } });
  } catch (error) {
    await connect.rollback();
    context.send(api.nfError(error).json());
  } finally {
    await connect.release();
  }
}
