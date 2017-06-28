MERGE scores AS T
  USING staging AS S
  ON (T.nomis_id = S.nomis_id)
WHEN NOT MATCHED BY TARGET
  THEN INSERT(nomis_id, score) VALUES(S.nomis_id, S.score)
WHEN MATCHED
  THEN UPDATE SET T.score = S.score, T.since = CURRENT_TIMESTAMP
OUTPUT $action, Inserted.*, Deleted.*;