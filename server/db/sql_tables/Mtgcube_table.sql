CREATE TABLE mtgcube (
	cube_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	player VARCHAR(255) NOT NULL,
	cube_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (player) REFERENCES player(username)
);

CREATE INDEX idx_owner
ON Mtgcube (player, cube_id);