export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "reactstorage41942a6f": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "function": {
        "S3Triggera8ae4c2a": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "storage": {
        "s3db": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "api": {
        "reactstorage": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    }
}