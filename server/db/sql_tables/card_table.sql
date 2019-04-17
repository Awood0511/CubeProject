CREATE TABLE Card (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	cmc int,
	manacost text,
	color text,
	cname VARCHAR(255),
	oracle_text text,
	flavor_text text,
	power text,
	toughness text,
	type_line text,
	image text,
	price float(10,2),
	rarity text,
	set_code varchar(10),
	set_name text,
	layout text,
	artist text,
	scryfall text,
	rulings text
);

CREATE UNIQUE INDEX idx_setcode
ON Card (cname, set_code);
