
CREATE TABLE users (
    id CHAR(11) PRIMARY KEY NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    fullname VARCHAR(255),
    role ENUM('user', 'admin', 'superadmin') DEFAULT 'user',
    password VARCHAR(255),
    phone VARCHAR(20),
    age INT,
    weight INT,
    allergies TEXT,
    auth_provider ENUM('local', 'microsoft') DEFAULT 'local',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);

CREATE TABLE medicines (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    image_url VARCHAR(255),
    type enum('Tablet', 'Capsule', 'Pack'), -- Type of medicine
    description TEXT,
    strength INT
);

CREATE TABLE medicine_instructions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medicine_id INT NOT NULL,
    content TEXT NOT NULL,
    type ENUM('Instruction', 'Warning', 'Side Effect') NOT NULL,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE medicine_instructions AUTO_INCREMENT = 1;


CREATE TABLE symptoms (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE medicine_doses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_id INT,
    min_weight INT,        -- in kg (nullable if not used)
    max_weight INT,        -- in kg
    min_age INT,           -- in months or years (specify unit)
    max_age INT,           -- in months or years
    dose_amount INT,       -- number of tablets
    dose_frequency VARCHAR(50),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE medicine_stocks (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    medicine_id INT NOT NULL,
    stock_amount INT CHECK (stock_amount >= 0),
    expire_at DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE medicine_symptoms (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    medicine_id INT NOT NULL,
    symptom_id INT NOT NULL,
    effectiveness DECIMAL(5,2) COMMENT 'Effectiveness score (e.g., 0-100)',
    priority INT COMMENT 'Priority of this medicine for this symptom',
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (symptom_id) REFERENCES symptoms(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE requests (
    code CHAR(10) PRIMARY KEY NOT NULL,
    user_id CHAR(11) NOT NULL,
    weight DECIMAL(5,2),
    additional_notes TEXT,
    allergies TEXT,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE request_symptoms (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    request_code CHAR(10) NOT NULL,
    symptom_id INT NOT NULL,
    FOREIGN KEY (request_code) REFERENCES requests(code) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (symptom_id) REFERENCES symptoms(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE request_medicines (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    request_code CHAR(10) NOT NULL,
    medicine_id INT NOT NULL,
    FOREIGN KEY (request_code) REFERENCES requests(code) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE VIEW medicine_request_hourly_summary AS
SELECT
    CAST(DATE_FORMAT(DATE_ADD(r.created_at, INTERVAL 1 HOUR), '%Y-%m-%d %H:00:00') AS DATETIME) AS time,
    m.id AS medicine_id,
    m.name AS medicine_name,
    COUNT(*) AS total
FROM
    request_medicines rm
JOIN
    requests r ON rm.request_code = r.code
JOIN
    medicines m ON rm.medicine_id = m.id
GROUP BY
    m.id, m.name, time
ORDER BY time;



# SELECT
#     m.id AS medicine_id,
#     m.name AS medicine_name,
#     COUNT(*) AS total
# FROM
#     request_medicines rm
# JOIN
#     medicines m ON rm.medicine_id = m.id
# GROUP BY
#     m.id, m.name
# ORDER BY total desc;