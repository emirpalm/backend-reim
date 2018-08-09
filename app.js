// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

// Inicializar variables
var app = express();

app.use(cors({
    origin: 'http://localhost:4200'
}));

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rutas
var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var usuarioRoutes = require('./routes/usuario');
var maniobraRoutes = require('./routes/maniobra');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// Rutas
app.use('/img', imagenesRoutes)
app.use('/upload', uploadRoutes);
app.use('/maniobra', maniobraRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Conexión a la base de datos Mongoose
mongoose.connect('mongodb://localhost:27017/reim', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos Mongoose: \x1b[32m%s\x1b[0m', 'online');
})

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})