BULK INSERT staging
FROM :filename
WITH (
    FORMATFILE = 'import_staging_data_format.xml',
    FORMAT = 'CSV',
    FIELDQUOTE = '"',
    DATA_SOURCE = 'storageblob',
    FORMATFILE_DATA_SOURCE = 'storageblob',
    FIRSTROW = 2 -- ignore header row
);
