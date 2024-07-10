const cors = require('cors');

const corsOptions = {
    origin: '/expensia-frontend.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
