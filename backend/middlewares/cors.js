const cors = require('cors');

const corsOptions = {
    origin: 'https://expensia-frontend.vercel.app',
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
