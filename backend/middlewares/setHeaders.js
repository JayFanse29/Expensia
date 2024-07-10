const setHeaders = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://expensia-frontend.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
};

module.exports = setHeaders;