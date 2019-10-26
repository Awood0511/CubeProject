DELIMITER |
CREATE FUNCTION TIMES_DRAFTED_IN_CUBE (cube_id INT, cname VARCHAR(255))
RETURNS INT READS SQL DATA
BEGIN
	DECLARE draft_count INT;
    SET draft_count = (
		SELECT COUNT(*) FROM draft, draft_picks, card
        WHERE draft.cube_id = cube_id AND draft.draft_id = draft_picks.draft_id AND  draft_picks.id = card.id AND card.cname = cname
	);
	RETURN draft_count;
END |
DELIMITER ;

DELIMITER |
CREATE FUNCTION PRIORITY_WITHIN_CUBE (cube_id INT, cname VARCHAR(255))
RETURNS FLOAT(4,2) READS SQL DATA
BEGIN
	DECLARE priority FLOAT(4,2);
    SET priority = (
		SELECT AVG(draft_picks.pick) FROM draft, draft_picks, card
        WHERE draft.cube_id = cube_id AND draft.draft_id = draft_picks.draft_id AND  draft_picks.id = card.id AND card.cname = cname
    );
	RETURN priority;
END |
DELIMITER ;