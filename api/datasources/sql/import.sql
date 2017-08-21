INSERT INTO staging(nomis_id, score)
SELECT * FROM OPENROWSET(
    BULK :filename,
    FORMATFILE = 'import_staging_data_format.xml',
    FORMAT = 'CSV',
    FIELDQUOTE = '"',
    DATA_SOURCE = 'storageblob',
    FORMATFILE_DATA_SOURCE = 'storageblob',
    FIRSTROW = 2 -- ignore header row
) AS "file";
