CREATE TABLE scores
(
    nomis_id VARCHAR(10),
    score DECIMAL(3,2),
    since DATETIME2
);
CREATE INDEX score_timestamps ON scores (since);