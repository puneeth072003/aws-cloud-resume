const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    const lambdaUrl = process.env.LAMBDA_URL;
    if (!lambdaUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "LAMBDA_URL not set in environment" }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Append the secret key as a query param (preserve any existing params)
    const url = lambdaUrl.includes('?')
      ? `${lambdaUrl}&key=oe7XZ2FvVVRpWkUMokTuEC3PuAKpy4u9`
      : `${lambdaUrl}?key=oe7XZ2FvVVRpWkUMokTuEC3PuAKpy4u9`;

    // Forward method and body for POST, GET otherwise
    const method = event.httpMethod || 'GET';
    const fetchOptions = { method };
    if (method === 'POST') {
      fetchOptions.body = event.body;
      fetchOptions.headers = { 'Content-Type': 'application/json' };
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};