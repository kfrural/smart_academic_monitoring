CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE study_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    study_hours INTEGER NOT NULL,
    performance_score INTEGER NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
