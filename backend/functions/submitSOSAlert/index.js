const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const TABLE_NAME = 'sos_alerts';
const USER_TABLE = 'ResQUsers';

exports.handler = async (event) => {
    console.log("Incoming event:", JSON.stringify(event));

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
    };

    const method = event.httpMethod;

    if (method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight passed' }),
        };
    }

    if (method === 'GET') {
        try {
            const username = event.queryStringParameters?.username;

            let result;

            if (!username || username === 'admin') {
                // Admin or no username - fetch all
                result = await dynamoDb.scan({ TableName: TABLE_NAME }).promise();
            } else {
                // Normal user - filter by username
                result = await dynamoDb.scan({
                    TableName: TABLE_NAME,
                    FilterExpression: "#username = :u",
                    ExpressionAttributeNames: { "#username": "username" },
                    ExpressionAttributeValues: { ":u": username },
                }).promise();
            }

            return { statusCode: 200, headers, body: JSON.stringify(result.Items) };
        } catch (err) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to fetch alerts', details: err.message }),
            };
        }
    }

    if (method === 'POST') {
        try {
            const body = JSON.parse(event.body);
            const timestamp = new Date().toISOString();
            const sos_id = uuidv4();

            const username = body.username;
            if (!username) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Username is required' }),
                };
            }

            // 🔍 Fetch user details using username
            const userData = await dynamoDb.get({
                TableName: USER_TABLE,
                Key: { username },
            }).promise();

            const phoneNumber = userData.Item?.contact || body.contact || '';

            const item = {
                sos_id,
                username, // ✅ Store only username, no 'name'
                contact: phoneNumber,
                location: body.location || '',
                urgency: body.urgency || 'medium',
                message: body.message || '',
                resources_required: body.resources_required || [],
                timestamp,
                status: 'Pending',
            };

            await dynamoDb.put({ TableName: TABLE_NAME, Item: item }).promise();
            console.log("✅ SOS saved:", item);

            // ✅ SMS notification (just using username)
            if (phoneNumber.startsWith('+')) {
                const smsMessage = `Hi ${username}, your SOS has been received. Help is on the way!`;
                const snsResponse = await sns.publish({
                    Message: smsMessage,
                    PhoneNumber: phoneNumber,
                }).promise();

                if (snsResponse.MessageId) {
                    console.log("✅ SMS sent successfully via SNS:", snsResponse.MessageId);
                } else {
                    console.warn("⚠️ SNS publish did not return MessageId");
                }
            } else {
                console.warn("⚠️ No valid phone number to send SMS.");
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'SOS submitted successfully', sos_id }),
            };
        } catch (err) {
            console.error("❌ Error during SOS submission:", err);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to submit alert', details: err.message }),
            };
        }
    }

    if (method === 'PUT') {
        try {
            const body = JSON.parse(event.body);
            const { sos_id, location, message, urgency } = body;

            if (!sos_id) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'sos_id is required for update' }) };
            }

            await dynamoDb.update({
                TableName: TABLE_NAME,
                Key: { sos_id },
                UpdateExpression: "set #loc = :l, #msg = :m, #urg = :u",
                ExpressionAttributeNames: {
                    "#loc": "location",
                    "#msg": "message",
                    "#urg": "urgency",
                },
                ExpressionAttributeValues: {
                    ":l": location,
                    ":m": message,
                    ":u": urgency,
                },
            }).promise();

            return { statusCode: 200, headers, body: JSON.stringify({ message: 'SOS alert updated successfully' }) };
        } catch (err) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to update alert', details: err.message }) };
        }
    }

    if (method === 'DELETE') {
        try {
            const body = JSON.parse(event.body);
            const { sos_id } = body;

            if (!sos_id) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'sos_id is required to delete alert' }) };
            }

            await dynamoDb.delete({ TableName: TABLE_NAME, Key: { sos_id } }).promise();
            return { statusCode: 200, headers, body: JSON.stringify({ message: 'SOS alert cancelled successfully' }) };
        } catch (err) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to delete alert', details: err.message }) };
        }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};