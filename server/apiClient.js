var ApiClient = require('wrap-api-client');

console.log('Wrap API client accessing', process.env.WRAP_API_URL);

module.exports = new ApiClient(process.env.WRAP_API_KEY, process.env.WRAP_API_URL);
