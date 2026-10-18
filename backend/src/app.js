const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const pool = require('./config/database');
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

// Rota de teste da conexão com o banco (será removida depois)
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM events');
    res.json({ status: 'ok', eventos: rows[0].total });
  } catch (error) {
    res.status(500).json({ status: 'erro', message: error.message });
  }
});

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
