FORMAT: 1A
HOST: http://viper-dev.hmpps.dsd.io

## Group VIPER Rating

The Violence in Prison Estimator Rating

### Record VIPER Rating [POST /offender/viper]

Records a single VIPER Rating from the dataset

+ Request Record a single VIPER Rating record (application/json)

    + Attributes (VIPER Rating)
        + nomsId: `A1234BC`
        + viperRating: `0.56`

+ Response 201 (application/json)

    Created

    + Headers

            Location: /offender/A1234BC/viper

    + Attributes (VIPER Rating)
        + nomsId: `A1234BC`
        + viperRating: `0.56`

+ Request Record multiple VIPER Rating record (application/json)

    + Attributes (array)
        + (VIPER Rating)
            + nomsId: `A1234BC`
            + viperRating: `0.56`
        + (VIPER Rating)
            + nomsId: `A5678BC`
            + viperRating: `0.65`

+ Response 201 (application/json)

    Created

    + Headers

            Location: /offender/viper?nomId=A1234BC,A5678BC

    + Attributes (array)
        + (VIPER Rating)
            + nomsId: `A1234BC`
            + viperRating: `0.56`
        + (VIPER Rating)
            + nomsId: `A5678BC`
            + viperRating: `0.65`

### Retrieve VIPER Rating [GET /offender/{nomsId}/viper]

Retrieves a single VIPER Rating from the dataset

+ Parameters
    + nomsId: `A1234BC` (string, required) - A known NOMS ID

+ Request Known nomsId (application/json)
    + Parameters
        + nomsId: `A1234BC`

+ Response 200 (application/json)

    Success

    + Attributes (VIPER Rating)
        + nomsId: `A1234BC`
        + viperRating: `0.56`

+ Request Unknown nomsId (application/json)
    + Parameters
        + nomsId: `C4321BA`

+ Response 404 (application/json)

    Resource Not Found

    + Attributes (HTTP Status Message)
        + code: `ResourceNotFound`
        + message: `/offender/C4321BA/viper does not exist`

+ Request Invalid nomsId (application/json)
    + Parameters
        + nomsId: `1ABCD23`

+ Response 409 (application/json)

    Invalid Argument

    + Attributes (HTTP Status Message)
        + code: `InvalidArgument`
        + message: `nomsId (INVALID): Invalid characters`

## Data Structures

### Create VIPER Rating

+ nomsId (string, required) - the NOMS ID of the new record

### VIPER Rating

+ nomsId (string, required) - A valid NOMS ID
+ viperRating (number, required) - A percentile VIPER Rating

### HTTP Status Message

+ code (string, required) - HTTP Status Code
+ message (string, required) - Description of status
