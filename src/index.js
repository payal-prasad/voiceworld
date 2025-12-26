require('dotenv').config();

const express = require('express');
const app = express();
const db = require('./models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');


// middleware
app.use(express.json());

// routes
app.use('/api/users', require('./api/users.routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// test route
app.get('/', (req, res) => {
  res.send('Voice World backend running');
});

// start server
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');

    app.listen(process.env.PORT || 3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);

    
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server running without DB connection');
    });
  });
