'use strict';

module.exports.meals = async (event) => {
    // console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    console.log('## EVENT: ' + serialize(event));
    try {
        return formatResponse(serialize({greet: "Hello"}));
    } catch(error) {
        return formatError(error);
    }
};

var formatResponse = function(body){
    var response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "isBase64Encoded": false,
            "multiValueHeaders": { 
            "X-Custom-Header": ["My value", "My other value"],
        },
        "body": body
    };
    return response;
};

var formatError = function(error){
    var response = {
    "statusCode": error.statusCode,
    "headers": {
        "Content-Type": "text/plain",
        "x-amzn-ErrorType": error.code
    },
        "isBase64Encoded": false,
        "body": error.code + ": " + error.message
    };
    return response;
};

var serialize = function(object) {
    return JSON.stringify(object, null, 2);
};
