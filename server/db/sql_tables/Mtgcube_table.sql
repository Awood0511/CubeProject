CREATE TABLE Mtgcube (
	player VARCHAR(255) NOT NULL,
	cube_name VARCHAR(255) UNIQUE NOT NULL,
	PRIMARY KEY(cube_name)
);

CREATE UNIQUE INDEX idx_owner
ON Mtgcube (cube_name, player);