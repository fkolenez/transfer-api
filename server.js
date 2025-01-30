import { fastify } from 'fastify';
import { Service } from './service.js';
import {isBelowMinimumAge, isCpfValid} from './util.js';

const server = fastify();
const database = new Service();

server.post('/users', async (request, reply) => {
    const { birth_date, document, name } = request.body;
    
    const birthDate = new Date(birth_date);

    if(!isBelowMinimumAge(birthDate)){
        return reply.status(400).send({
            "detail": "User is under age.",
            "status": 400,
	        "title": "Bad Request"
        });
    }

    if(!isCpfValid(document)){
        return reply.status(400).send({
            "detail": "Document is not valid.",
            "status": 400,
	        "title": "Bad Request"
        });
    }

    const user = await database.createUser({
        birth_date, document, name,
    });

    return reply.status(201).send({
        id: user.id,
    });
});

server.post('/transfers', async (request, reply) => {
    const { 
        payee: { document: payee_document, name: payee_name }, 
        payer: { document: payer_document, name: payer_name }, 
        value 
    } = request.body;

    if(!isCpfValid(payee_document)){
        return reply.status(400).send({
            "detail": "Payee document is not valid.",
            "status": 400,
	        "title": "Bad Request"
        });
    }

    if(!isCpfValid(payer_document)){
        return reply.status(400).send({
            "detail": "Payee document is not valid.",
            "status": 400,
	        "title": "Bad Request"
        });
    }
    
    const payeeExists = await database.findUserByNameDocument(payee_document, payee_name);
    if(!payeeExists) {
        return reply.status(400).send({
            "detail": "Not registered payee.",
            "status": 400,
            "title": "Bad Request"
        });
    }

    if(value < 0.01){
        return reply.status(400).send({
            "detail": "Invalid value.",
            "status": 400,
	        "title": "Bad Request"
        });
    }

    const transfer = await database.createTransfer({
        payee: { document: payee_document, name: payee_name }, 
        payer: { document: payer_document, name: payer_name }, 
        value,
    });

    return reply.status(200).send({
        id: transfer.id,
    })
});

server.get('/transfers/:id', async (request, reply) => {
    const transferId = request.params.id;

    const consuntedTransfer = await database.transferConsult(transferId); 
 
    return reply.status(200).send({
        conclusion_date: consuntedTransfer.conclusion_date,
        creation_date: consuntedTransfer.creation_date,
        last_modification_date: consuntedTransfer.last_modification_date,
        payee: {
            document: consuntedTransfer.payee_document,
            name: consuntedTransfer.payee_name,
        },
        payer: {
            document: consuntedTransfer.payer_document,
            name: consuntedTransfer.payer_name,
        },
        status: consuntedTransfer.status,
        value: consuntedTransfer.value,
    });
});

server.listen({
    port: 3333,
    host: 'localhost'
});

