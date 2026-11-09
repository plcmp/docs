create or replace view company.v4employee as 
 SELECT id,
    firstname,
    lastname,
    patronymic,
    gender,
    birthdate,
    note
   FROM company.employee main
  WHERE nfc.f4role_unitprivs8check('company.employee'::character varying);