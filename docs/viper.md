FORMAT: 1A
HOST: http://viper-dev.hmpps.dsd.io

## Group VIPER Rating

The Violence in Prison Estimator Rating

### Retrieve VIPER Rating [GET /offender/{nomsId}/viper]

Retrieves a single VIPER Rating from the dataset

+ Parameters
    + nomsId: `A1234BC` (string, required) - A known NOMS ID

+ Request Known nomsId (application/json)
    + Parameters
        + nomsId: `A1234BC`

+ Response 200 (application/json)

    Success

    + Attributes (object)
        + nomsId: `A1234BC`
        + viperRating: 0.56 (number)

    + Schema

            {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "nomsId": {
                        "type": "string",
                        "description": "A valid NOMS ID"
                    },
                    "viperRating": {
                        "type": "number",
                        "description": "A percentile VIPER Rating"
                    }
                },
                "required": [
                    "nomsId",
                    "viperRating"
                ]
            }
