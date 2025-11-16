const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'sos_alerts'; // your existing table

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,GET',
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight passed' }),
        };
    }

    if (event.httpMethod === 'GET') {
        try {
            const scanParams = {
                TableName: TABLE_NAME,
            };
            const result = await dynamoDb.scan(scanParams).promise();
            const allAlerts = result.Items || [];

            const total = allAlerts.length;
            const pending = allAlerts.filter(a => a.status === 'Pending').length;
            const resolved = allAlerts.filter(a => a.status === 'Resolved').length;
            const volunteers = new Set(allAlerts.map(a => a.volunteer)).size;

            const response = [
                { title: "Total Alerts", value: total, icon: "alert-triangle", color: "bg-red-200" },
                { title: "Pending", value: pending, icon: "clock", color: "bg-yellow-200" },
                { title: "Resolved", value: resolved, icon: "check-circle", color: "bg-green-200" },
                { title: "Volunteers", value: volunteers, icon: "users", color: "bg-blue-200" }
            ];

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(response),
            };
        } catch (error) {
            console.error("Error getting NGO stats:", error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to fetch stats', details: error.message }),
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
    };
};