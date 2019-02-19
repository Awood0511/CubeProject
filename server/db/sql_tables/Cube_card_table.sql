CREATE TABLE cube_card (
	id INT NOT NULL,
    cube_name VARCHAR(255) NOT NULL,
    copies INT, CHECK (copies >= 1),
    FOREIGN KEY (id) REFERENCES Card(id),
    FOREIGN KEY (cube_name) REFERENCES Mtgcube(cube_name),
    PRIMARY KEY(cube_name,id)
);