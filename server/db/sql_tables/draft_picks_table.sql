CREATE TABLE draft_picks (
	draft_id INT,
	id INT,
	pack INT,
	pick INT,
	PRIMARY KEY (draft_id, pack, pick),
	FOREIGN KEY (id) REFERENCES Card(id),
    FOREIGN KEY (draft_id) REFERENCES Draft(draft_id)
);
