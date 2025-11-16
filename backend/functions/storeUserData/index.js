const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const cognito = new AWS.CognitoIdentityServiceProvider();

const TABLE_NAME = "ResQUsers";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

exports.handler = async (event) => {
    console.log("Incoming event:", JSON.stringify(event));

    const method = (event.httpMethod || "").toUpperCase();
    let body = {};
    try {
        if (event.body && typeof event.body === "string") {
            body = JSON.parse(event.body);
        } else if (event.body && typeof event.body === "object") {
            body = event.body;
        }
    } catch (err) {
        console.error("Failed to parse body:", err);
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Invalid JSON body" }),
        };
    }

    try {
        // ✅ POST - Create user
        if (method === "POST") {
            let { username, contact, role } = body;
            const timestamp = new Date().toISOString();

            // Prevent anyone from registering as admin if it already exists
            if (username === "admin_resqnow") {
                role = "admin";

                // Check if admin already exists in DB
                const checkAdmin = await dynamo.get({
                    TableName: TABLE_NAME,
                    Key: { username: "admin_resqnow" },
                }).promise();

                if (checkAdmin.Item) {
                    return {
                        statusCode: 403,
                        headers: corsHeaders,
                        body: JSON.stringify({ error: "Admin account already exists. You cannot create another." }),
                    };
                }
            }

            // ✅ First confirm user in Cognito
            try {
                await cognito.adminConfirmSignUp({
                    UserPoolId: "ap-south-1_tPsUbgjFV",
                    Username: username,
                }).promise();
            } catch (err) {
                console.error("Cognito confirmation failed:", err);
                return {
                    statusCode: 500,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Failed to confirm user in Cognito", details: err.message }),
                };
            }

            // ✅ Then insert into DynamoDB
            const params = {
                TableName: TABLE_NAME,
                Item: {
                    username,
                    contact,
                    role,
                    timestamp,
                },
            };

            await dynamo.put(params).promise();

            // ✅ Attempt SNS number verification
            try {
                const phoneNumber = contact.startsWith("+") ? contact : `+91${contact}`;

                await sns.setSMSAttributes({
                    attributes: {
                        DefaultSMSType: "Transactional",
                    },
                }).promise();

                await sns.publish({
                    Message: "Your ResQNow account has been created successfully.",
                    PhoneNumber: phoneNumber,
                }).promise();
            } catch (snsError) {
                console.warn("SNS verification warning:", snsError.message);
            }

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: "User created, confirmed, and SMS attempted." }),
            };
        }
        // ✅ GET - Fetch user or scan by role
        if (method === "GET") {
            const qs = event.queryStringParameters;

            if (qs?.scan === "true") {
                const roleFilter = qs?.role;

                const params = {
                    TableName: TABLE_NAME,
                    ...(roleFilter && {
                        FilterExpression: "#rl = :roleVal",
                        ExpressionAttributeNames: { "#rl": "role" },
                        ExpressionAttributeValues: { ":roleVal": roleFilter },
                    }),
                };

                const result = await dynamo.scan(params).promise();
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({ Items: result.Items }),
                };
            }

            const username = qs?.username;
            if (!username) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Username is required in query params" }),
                };
            }

            const params = {
                TableName: TABLE_NAME,
                Key: { username },
            };

            const result = await dynamo.get(params).promise();
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify(result.Item || {}),
            };
        }

        // ✅ PUT - Update user
        if (method === "PUT") {
            const { username, contact, role } = body;
            if (!username) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Username is required in request body" }),
                };
            }

            const params = {
                TableName: TABLE_NAME,
                Key: { username },
                UpdateExpression: "set #ct = :c, #rl = :r, #lu = :lu",
                ExpressionAttributeNames: {
                    "#ct": "contact",
                    "#rl": "role",
                    "#lu": "lastUpdated",
                },
                ExpressionAttributeValues: {
                    ":c": contact,
                    ":r": role,
                    ":lu": new Date().toISOString(),
                },
                ReturnValues: "UPDATED_NEW",
            };

            const result = await dynamo.update(params).promise();
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: "User updated", data: result.Attributes }),
            };
        }

        // ✅ DELETE - Remove user
        if (method === "DELETE") {
            const username = event.queryStringParameters?.username;
            if (!username) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Username is required in query params" }),
                };
            }

            const params = {
                TableName: TABLE_NAME,
                Key: { username },
            };

            await dynamo.delete(params).promise();
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: "User deleted" }),
            };
        }

        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    } catch (err) {
        console.error("Lambda execution error:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: `Failed to process ${method} request` }),
        };
    }
};