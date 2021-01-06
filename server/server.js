const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const apiRouter = require('./routes/apiRouter');
const testSchema = require('./schema/testSchema');

const PORT = process.env.PORT || 3000;

// Load env vars
dotenv.config({ path: './config/config.env' });

// Create the express app
const app = express();
// Middleware to parse incoming requests with JSON payloads
app.use(express.json());
// Middleware to parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/build', express.static(path.join(__dirname, '../build')));

// Serve favicon
app.use('/favicon', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/images/favicon.ico'));
});

// API route
app.use('/api', apiRouter);

// GraphQL route
app.use(
  '/graphql',
  graphqlHTTP({
    schema: testSchema,
    graphiql: true,
  }),
);

// Serve index.html for routes declared with react router
app.use('/prototyper', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../client/index.html')));
app.use('/', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../client/index.html')));

// Catch 404 error
app.use((req, res, next) => res.status(404).send('Not Found'));

// Set global error handler
app.use((error, req, res, next) => {
  const defaultError = {
    log: 'An error occured in middleware',
    status: 400,
    message: { error: 'An error occurred' },
  };
  const errObj = { ...defaultError, ...error };
  return res.status(errObj.status).json(errObj.message);
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
