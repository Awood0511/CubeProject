CREATE TABLE player (
	username VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
	pass VARCHAR(255) NOT NULL
);