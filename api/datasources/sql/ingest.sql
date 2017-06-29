MERGE scores AS T
  USING staging AS S
  ON (T.nomis_id = S.nomis_id)
WHEN NOT MATCHED BY TARGET
  THEN INSERT(nomis_id, score) VALUES(S.nomis_id, S.score)
WHEN MATCHED
  THEN UPDATE SET T.score = S.score, T.since = CURRENT_TIMESTAMP
OUTPUT $action as operation, Inserted.nomis_id as nomis_id, Inserted.since as new_since, Inserted.score as new_score, Deleted.since as old_since, Deleted.score as old_score;