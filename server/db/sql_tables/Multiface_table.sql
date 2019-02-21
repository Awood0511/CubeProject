CREATE TABLE multiface (
	mf_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id int NOT NULL,
	manacost text,
	cname VARCHAR(255),
	oracle_text text,
	flavor_text text,
	power text,
	toughness text,
	type_line text,
	image text,
    primary_face tinyint(1),
    FOREIGN KEY (id) REFERENCES Card(id)
);

CREATE UNIQUE INDEX idx_faces
ON multiface (mf_id, id);