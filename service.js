import { randomUUID } from 'crypto';
import sql from './connection.js';

export class Service {
    async createUser(user) {
        const { birth_date, document, name } = user;

        const [createdUser] = await sql`
        insert into users (birth_date, document, name) VALUES (${birth_date}, ${document}, ${name}) returning *`;
        return createdUser;
    }

    async createTransfer(data) {
        const { 
            payee: { document: payee_document, name: payee_name }, 
            payer: { document: payer_document, name: payer_name }, 
            value 
        } = data;

        const [createdTransfer] = await sql`
        insert into transfers (payee_document, payee_name, payer_document, payer_name, value) 
        VALUES (${payee_document}, ${payee_name}, ${payer_document}, ${payer_name}, ${value}) returning *;
        `;
        return createdTransfer;
    }

    async transferConsult(id) {
        const [transferConsult] = await sql`
            select * from transfers where id = ${id};
        `;
        return transferConsult;
    }

    async findUserByNameDocument(document, name) {
        const [userDocument] = await sql`select document, name from users where document = ${document} and name = ${name};`;
        return userDocument;
    }
}
