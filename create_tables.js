`CREATE TABLE transferencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payee_document VARCHAR(14),
    payee_name VARCHAR(100),
    payer_document VARCHAR(14),
    payer_name VARCHAR(100),
    value DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'concluded',
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    conclusion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`