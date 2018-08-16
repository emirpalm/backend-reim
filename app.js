// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

// Inicializar variables
var app = express();

app.use(cors({
    origin: 'http://www.mieryteran.com.mx'
}));


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar Rutas
var appRoutes = require('./routes/app');
var uploadRoutes = require('./routes/upload');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var imagenesRoutes = require('./routes/imagenes');
var maniobraRoutes = require('./routes/maniobra');
var operadorRoutes = require('./routes/operador');
var placasRoutes = require('./routes/placas');
var contenedorRoutes = require('./routes/contenedor');
var clienteRoutes = require('./routes/cliente');
var buesquedaRoutes = require('./routes/busqueda');

// Conexión a la base de datos Mongoose
mongoose.connect('mongodb://myDbAdmin:reim*0348@192.168.2.253:27017/reim', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos Mongoose: \x1b[32m%s\x1b[0m', 'online');
})


// Rutas
app.use('/busqueda', buesquedaRoutes)
app.use('/cliente', clienteRoutes)
app.use('/contenedor', contenedorRoutes)
app.use('/placas', placasRoutes)
app.use('/operador', operadorRoutes)
app.use('/maniobra', maniobraRoutes)
app.use('/img', imagenesRoutes)
app.use('/upload', uploadRoutes)
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})