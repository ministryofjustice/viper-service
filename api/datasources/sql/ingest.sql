MERGE scores AS T
USING (SELECT s1.*
       FROM staging s1
         JOIN (SELECT
                 nomis_id,
                 MAX(uploaded) uploaded
               FROM staging
               GROUP BY nomis_id) s2
           ON s1.nomis_id = s2.nomis_id AND s1.uploaded = s2.uploaded) AS S
ON (T.nomis_id = S.nomis_id)
WHEN NOT MATCHED BY TARGET
THEN INSERT (nomis_id, score) VALUES (S.nomis_id, S.score)
WHEN MATCHED
THEN UPDATE SET T.score = S.score, T.since = CURRENT_TIMESTAMP
OUTPUT $action AS operation, Inserted.nomis_id AS nomis_id, Inserted.since AS new_since, Inserted.score AS new_score, Deleted.since AS old_since, Deleted.score AS old_score;