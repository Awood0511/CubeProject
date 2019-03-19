CREATE TABLE draft (
	draft_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	cube_id INT,
    player VARCHAR(255),
    draft_time DATETIME,
    FOREIGN KEY (cube_id) REFERENCES Mtgcube(cube_id),
    FOREIGN KEY (player) REFERENCES player(username)
);
