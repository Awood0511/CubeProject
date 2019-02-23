CREATE TABLE cube_card (
	id INT NOT NULL,
    cube_id INT NOT NULL,
    color text,
    copies INT, CHECK (copies >= 1),
    FOREIGN KEY (id) REFERENCES card(id),
    FOREIGN KEY (cube_id) REFERENCES mtgcube(cube_id),
    PRIMARY KEY(cube_id,id)
);

CREATE UNIQUE INDEX idx_cards_in_cube
ON cube_card (id, cube_id);