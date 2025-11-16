const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const TABLE_NAME = 'sos_alerts';
const USER_TABLE = 'ResQUsers';

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,DELETE',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'CORS passed' }) };
    }

    if (event.httpMethod === 'GET') {
        try {
            const result = await dynamoDb.scan({ TableName: TABLE_NAME }).promise();
            return { statusCode: 200, headers, body: JSON.stringify(result.Items) };
        } catch (err) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
        }
    }

    if (event.httpMethod === 'PUT') {
        const body = JSON.parse(event.body);
        const { sos_id, status, assigned_volunteer, resources_required } = body;

        if (!sos_id) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing sos_id" }) };
        }

        let updateExp = [];
        let attrNames = {};
        let attrValues = {};

        if (status) {
            updateExp.push("#s = :s");
            attrNames["#s"] = "status";
            attrValues[":s"] = status;
        }

        if (assigned_volunteer) {
            updateExp.push("#v = :v");
            attrNames["#v"] = "assigned_volunteer";
            attrValues[":v"] = assigned_volunteer;
        }

        if (resources_required) {
            updateExp.push("#r = :r");
            attrNames["#r"] = "resources_required";
            attrValues[":r"] = resources_required;
        }

        const updateExpression = "SET " + updateExp.join(", ");

        try {
            await dynamoDb.update({
                TableName: TABLE_NAME,
                Key: { sos_id },
                UpdateExpression: updateExpression,
                ExpressionAttributeNames: attrNames,
                ExpressionAttributeValues: attrValues,
            }).promise();

            // 🔔 If status updated to 'Resolved' or 'Help Arrived', send SMS
            if (status === 'Resolved' || status === 'Help Arrived') {
                const alertData = await dynamoDb.get({ TableName: TABLE_NAME, Key: { sos_id } }).promise();
                const username = alertData.Item?.username;

                if (username) {
                    const userData = await dynamoDb.get({
                        TableName: USER_TABLE,
                        Key: { username }
                    }).promise();

                    const phoneNumber = userData.Item?.phone;
                    if (phoneNumber) {
                        const smsMessage = `Hi ${alertData.Item?.name || 'User'}, your SOS has been marked as "${status}".`;

                        await sns.publish({
                            Message: smsMessage,
                            PhoneNumber: phoneNumber,
                        }).promise();
                    }
                }
            }

            return { statusCode: 200, headers, body: JSON.stringify({ message: "Updated successfully" }) };
        } catch (err) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: "Update failed", details: err.message }) };
        }
    }

    if (event.httpMethod === 'DELETE') {
        const body = JSON.parse(event.body);
        const { sos_id } = body;

        if (!sos_id) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing sos_id" }) };
        }

        try {
            await dynamoDb.delete({ TableName: TABLE_NAME, Key: { sos_id } }).promise();
            return { statusCode: 200, headers, body: JSON.stringify({ message: "Alert deleted" }) };
        } catch (err) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: "Delete failed", details: err.message }) };
        }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
};