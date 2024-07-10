const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const setHeaders = require('./middlewares/setHeaders');
const corsMiddleware = require('./middlewares/cors');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
connectDB();

app.use(express.json());
app.use(logger);
app.use(setHeaders);
app.use(corsMiddleware);
app.options('*', corsMiddleware);


// EXAMPLE
// app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req,res) => {
    res.send("Server is running");
})

app.use('/expensia/users', userRoutes);
app.use('/expensia/groups', groupRoutes);
app.use('/expensia/invite', inviteRoutes);
app.use('/expensia/expense', expenseRoutes);
app.use('/expensia/transactions', transactionRoutes);

app.use(errorHandler);

module.exports = app;
