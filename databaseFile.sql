DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(200) NOT NULL,
  last_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE signatures (
  id SERIAL PRIMARY KEY,
  signature TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL -- foreign
);

CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  age INTEGER,
  city VARCHAR(255),
  homepage VARCHAR(255),
  user_id INTEGER REFERENCES users(id) NOT NULL -- foreign
);
