const cors = require('cors');

const corsOptions = {
    origin: 'https://expensia-frontend.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

module.exports = cors(corsOptions);
