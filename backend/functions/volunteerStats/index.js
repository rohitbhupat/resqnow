const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "sos_alerts";

exports.handler = async (event) => {
    console.log("EVENT:", JSON.stringify(event));
    const method = event.httpMethod;

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,DELETE",
    };

    if (method === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "CORS preflight success" }),
        };
    }

    // ✅ GET: Fetch all SOS alerts (sorted by latest)
    if (method === "GET") {
        try {
            const result = await dynamo.scan({ TableName: TABLE_NAME }).promise();

            // Optional: Sort by newest timestamp
            const sorted = result.Items.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(sorted),
            };
        } catch (err) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: err.message }),
            };
        }
    }

    // ✅ PUT: Volunteer joins SOS
    if (method === "PUT") {
        const body = JSON.parse(event.body);
        const { sos_id, volunteer_id } = body;

        if (!sos_id || !volunteer_id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing sos_id or volunteer_id" }),
            };
        }

        try {
            await dynamo.update({
                TableName: TABLE_NAME,
                Key: { sos_id },
                UpdateExpression: "SET #s = :s, volunteer_id = :v",
                ExpressionAttributeNames: {
                    "#s": "status",
                },
                ExpressionAttributeValues: {
                    ":s": "In Progress",
                    ":v": volunteer_id,
                },
            }).promise();

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: "SOS marked In Progress by volunteer" }),
            };
        } catch (err) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Update failed", details: err.message }),
            };
        }
    }

    // ✅ DELETE: Remove SOS
    if (method === "DELETE") {
        const body = JSON.parse(event.body);
        const { sos_id } = body;

        if (!sos_id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing sos_id" }),
            };
        }

        try {
            await dynamo.delete({ TableName: TABLE_NAME, Key: { sos_id } }).promise();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: "SOS alert deleted" }),
            };
        } catch (err) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Delete failed", details: err.message }),
            };
        }
    }

    // ❌ Method not allowed
    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
    };
};