const express = require('express');
const mongoose = require('mongoose');
const authController = require('./controllers/authController')
const dotenv = require('dotenv');
const routes = require('./routes/routes');
const userRoutes = require('./routes/userRoutes');

const router = express.Router();

const app = express();


app.use(express.json());
dotenv.config();

const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://davidperlera:root@todoapi.dwgyvci.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('connected to mongoDB');
});

// test rute
app.get('/', (req, res) => {
  res.send('Api on Express working in Port 3000');
});

app.use('/api/auth', routes);
app.use('/api/user', userRoutes);


app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});