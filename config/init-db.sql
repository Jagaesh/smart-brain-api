--Table pour stocker les identifiants(email + hash)
CREATE TABLE login(
  id SERIAL PRIMARY KEY,
  hash VARCHAR(100) NOT NULL,
  email TEXT UNIQUE NOT NULL
);

--Table pour stocker les utilisateurs(profil visible)
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email TEXT UNIQUE NOT NULL,
  entries BIGINT DEFAULT 0,
  joined TIMESTAMP NOT NULL
);
