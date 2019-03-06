CREATE TABLE draft_picks (
	id INT,
	cube_id INT,
	player VARCHAR(255),
	pack INT,
	pick INT,
	draft_time DATETIME,
	PRIMARY KEY (cube_id, player, pack, pick, draft_time),
	FOREIGN KEY (id) REFERENCES Card(id),
	FOREIGN KEY (cube_id) REFERENCES mtgcube(cube_id)
);
