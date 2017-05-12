FORMAT: 1A
HOST: http://viper-dev.hmpps.dsd.io

## Group VIPER Score

Retrieve a previously determined VIPER Score for a known offender

### Retrieve VIPER Score [GET /offender/{nomsId}/viper]

Retrieves a single VIPER Score from the dataset

+ Parameters
    + nomsId (required, string `A1234BC`) ... A known NOMS ID

+ Request Known nomsId (application/json)
    + Parameters
        + nomsId (`A1234BC`) ... A known NOMS ID

+ Response 200 (application/json)

    + Body

            {
              "nomsId": "A1234BC",
              "viperRating": 0.56
            }

    + Schema


            {
              "type": "object",
              "required": [
                "nomsId",
                "viperRating"
              ],
              "properties": {
                "nomsId": {
                  "type": "string",
                  "description": "The NOMS ID of the relevant record"
                },
                "viperRating": {
                  "type": "number",
                  "description": "A percentile VIPER Score"
                }
              }
            }

+ Request Unknown nomsId (application/json)
  + Parameters
      + nomsId (`C4321BA`) ... An unknown NOMS ID

+ Response 404 (application/json)

    Not Found

    + Body

            {
              "code": "ResourceNotFound",
              "message": "/offender/C4321BA/viper does not exist"
            }

    + Schema

            {
              "required": [
                "code",
                "message"
              ],
              "properties": {
                "code": {
                  "type": "string"
                },
                "message": {
                  "type": "string"
                }
              }
            }

+ Request Invalid nomsId (application/json)
  + Parameters
      + nomsId (`1ABCD23`) ... An invalid NOMS ID

+ Response 409 (application/json)

    Invalid Argument

    + Body

            {
              "code": "InvalidArgument",
              "message": "nomsId (INVALID): Invalid characters"
            }

    + Schema

            {
              "required": [
                "code",
                "message"
              ],
              "properties": {
                "code": {
                  "type": "string"
                },
                "message": {
                  "type": "string"
                }
              }
            }
