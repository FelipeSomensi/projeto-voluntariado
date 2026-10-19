const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const specification = require('./config/swagger');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/openapi.json', (req, res) => {
  res.json(specification);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specification));

app.use('/events', eventRoutes);
app.use('/volunteers', volunteerRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Deve ser sempre o último middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});