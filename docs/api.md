# Sumário

- [[#Funcionalidades]]
	- [[#Criar um usuário]]
	- [[#Criar uma transferência]]
	- [[#Consultar a situação de uma transferência]]
- [[#Respostas de erro]]
	- [[#400 Bad Request]]
	- [[#404 Not Found]]
	- [[#500 Internal Server Error]]
- [[#Links úteis]]

---

# Funcionalidades

## Criar um usuário

### Requisição

A requisição para criação de um usuário deve estar de acordo com o seguinte contrato:

| Campo        | Tipo   | Descrição                                                                                                |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------- |
| `birth_date` | String | Data de nascimento do usuário<br><br>Formato: `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`                             |
| `document`   | String | Documento único de identificação do usuário (CPF ou CNPJ)<br><br>Formato: `^[0-9]{11}$` ou `^[0-9]{14}$` |
| `name`       | String | Nome completo ou razão social do usuário                                                                 |

Exemplo de requisição:

```http
POST /users HTTP/1.1
Content-Type: application/json

{
	"birth_date": "2000-01-01T00:00:00.000Z",
	"document": "11122233344",
	"name": "John Doe"
}
```

### Resposta

A resposta para criação de um usuário deve estar de acordo com o seguinte contrato:

| Campo | Tipo   | Descrição                                                                                                                                 |
| ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | String | Identificador único do usuário no sistema<br><br>Formato: `^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$` |

Exemplo de resposta de sucesso:

```http
HTTP/1.1 200 OK
Content-Language: en-US
Content-Type: application/json

{
	"id": "70d72b58-c29d-40c0-9efe-a97f1800b832"
}
```

### Requisitos

- O sistema não deve permitir a criação de usuários menores que 18 anos;
- O sistema não deve permitir a criação de usuários com um CPF ou CNPJ inválido.

## Criar uma transferência

### Requisição

A requisição para criação de uma transferência deve estar de acordo com o seguinte contrato:

| Campo            | Tipo   | Descrição                                                                                                          |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| `payee`          | Object | Informações do usuário recebedor                                                                                   |
| `payee.document` | String | Documento único de identificação do usuário recebedor (CPF ou CNPJ)<br><br>Formato: `^[0-9]{11}$` ou `^[0-9]{14}$` |
| `payee.name`     | String | Nome completo ou razão social do usuário recebedor                                                                 |
| `payer`          | Object | Informações do pagador externo                                                                                     |
| `payer.document` | String | Documento único de identificação do pagador externo (CPF ou CNPJ)<br><br>Formato: `^[0-9]{11}$` ou `^[0-9]{14}$`   |
| `payer.name`     | String | Nome completo ou razão social do pagador externo                                                                   |
| `value`          | String | Valor total da transferência<br><br>Formato: `^[0-9]{1,14}.[0-9]{2}$`                                              |

Exemplo de requisição:

```http
POST /transfers HTTP/1.1
Content-Type: application/json

{
	"payee": {
		"document": "11122233344",
		"name": "John Doe"
	},
	"payer": {
		"document": "11222333444455",
		"name": "Acme Corporation"
	},
	"value": "10.95"
}
```

### Resposta

A resposta para criação de uma transferência deve estar de acordo com o seguinte contrato:

| Campo | Tipo   | Descrição                                                                                                                                       |
| ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | String | Identificador único da transferência no sistema<br><br>Formato: `^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$` |

Exemplo de resposta de sucesso:

```http
HTTP/1.1 200 OK
Content-Language: en-US
Content-Type: application/json

{
	"id": "df791db6-2d02-4680-9fe4-067757be2df2"
}
```

### Requisitos

- O sistema não deve permitir a criação de transferências com um CPF ou CNPJ de pagador externo inválido;
- O sistema não deve permitir a criação de transferências com um CPF de usuário recebedor inválido;
- O sistema não deve permitir a criação de transferências com um CPF de usuário recebedor que não tenha sido previamente criado;
- O sistema não deve permitir a criação de transferências com um valor total da transferência menor que R$ 0,01.

## Consultar a situação de uma transferência

### Requisição

A requisição para consultar uma transferência deve estar de acordo com o seguinte contrato:

| Campo         | Tipo   | Descrição                                                                                                                                       |
| ------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `transfer_id` | String | Identificador único da transferência no sistema<br><br>Formato: `^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$` |

Exemplo de requisição:

```http
GET /transfers/{transfer_id} HTTP/1.1
```

### Resposta

A resposta para consultar uma transferência deve estar de acordo com o seguinte contrato:

| Campo                    | Tipo   | Descrição                                                                                                        |
| ------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------- |
| `conclusion_date`        | String | (*Opcional*) Data de conclusão da transferência no sistema<br><br>Formato: `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`        |
| `creation_date`          | String | Data de criação da transferência no sistema<br><br>Formato: `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`                       |
| `last_modification_date` | String | Data da última modificação da transferência no sistema<br><br>Formato: `yyyy-MM-dd'T'hh:mm:ss.SSS'Z'`            |
| `payee`                  | Object | Informações do usuário recebedor                                                                                 |
| `payee.document`         | String | Documento único de identificação do usuário recebedor (CPF)<br><br>Formato: `^[0-9]{11}$`                        |
| `payee.name`             | String | Nome completo ou razão social do usuário recebedor                                                               |
| `payer`                  | Object | Informações do pagador externo                                                                                   |
| `payer.document`         | String | Documento único de identificação do pagador externo (CPF ou CNPJ)<br><br>Formato: `^[0-9]{11}$` ou `^[0-9]{14}$` |
| `payer.name`             | String | Nome completo ou razão social do pagador externo                                                                 |
| `status`                 | String | Situação atual da transferência<br><br>Valores: `CONCLUDED`, `FAILED` e `IN_PROGRESS`                            |
| `value`                  | String | Valor total da transferência<br><br>Formato: `^[0-9]{1,14}.[0-9]{2}$`                                            |

Exemplo de resposta de sucesso:

1. Em progresso

```http
HTTP/1.1 200 OK
Content-Language: en-US
Content-Type: application/json

{
	"conclusion_date": null,
	"creation_date": "2000-01-01T00:00:00.000Z",
	"last_modification_date": "2000-01-01T00:00:00.000Z",
	"payee": {
		"document": "11122233344",
		"name": "John Doe"
	},
	"payer": {
		"document": "11222333444455",
		"name": "Acme Corporation"
	},
	"status": "IN_PROGRESS",
	"value": "10.95"
}
```

2. Concluída

```http
HTTP/1.1 200 OK
Content-Language: en-US
Content-Type: application/json

{
	"conclusion_date": "2000-01-02T00:00:00.000Z",
	"creation_date": "2000-01-01T00:00:00.000Z",
	"last_modification_date": "2000-01-02T00:00:00.000Z",
	"payee": {
		"document": "11122233344",
		"name": "John Doe"
	},
	"payer": {
		"document": "11222333444455",
		"name": "Acme Corporation"
	},
	"status": "CONCLUDED",
	"value": "10.95"
}
```

3. Com falha

```http
HTTP/1.1 200 OK
Content-Language: en-US
Content-Type: application/json

{
	"conclusion_date": null,
	"creation_date": "2000-01-01T00:00:00.000Z",
	"last_modification_date": "2000-01-02T00:00:00.000Z",
	"payee": {
		"document": "11122233344",
		"name": "John Doe"
	},
	"payer": {
		"document": "11222333444455",
		"name": "Acme Corporation"
	},
	"status": "FAILED",
	"value": "10.95"
}
```

---
[[#Sumário|Voltar ao topo]]

# Respostas de erro

As respostas de erro retornadas pela API devem estar de acordo com as definições da [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807). A seguir são exemplificados os casos de erro mais comuns com mensagens genéricas, não limitando as respostas somente a estes itens, onde podem ser modificadas e adicionadas conforme necessário, desde que respeitem a padronização da RFC. 

## 400 Bad Request

Utilizada para requisições com corpo inválido ou com informações que violam regras de negócio.

```http
HTTP/1.1 400 Bad Request
Content-Language: en-US
Content-Type: application/problem+json

{
	"detail": "The \"value\" field does not respect the schema.",
	"status": 400,
	"title": "Bad Request"
}
```

## 404 Not Found

Utilizada para requisições que buscam por um item específico mas o mesmo não foi encontrado pelo sistema.

```http
HTTP/1.1 404 Not Found
Content-Language: en-US
Content-Type: application/problem+json

{
	"detail": "The specified resource was not found.",
	"status": 404,
	"title": "Not Found"
}
```

## 500 Internal Server Error

Utilizada para requisições que geraram erros inesperados no sistema.

```http
HTTP/1.1 500 Internal Server Error
Content-Language: en-US
Content-Type: application/problem+json

{
	"detail": "An unexpected error has occurred. Please, try again later.",
	"status": 500,
	"title": "Internal Server Error"
}
```

---
[[#Sumário|Voltar ao topo]]

# Links úteis

- https://datatracker.ietf.org/doc/html/rfc7807
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
- https://en.wikipedia.org/wiki/Coordinated_Universal_Time
- https://en.wikipedia.org/wiki/Regular_expression
- https://en.wikipedia.org/wiki/Universally_unique_identifier
- https://www.json.org/json-en.html
