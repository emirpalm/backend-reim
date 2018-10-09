// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

// Inicializar variables
var app = express();

var corsOptions = {
    origin: '*',
    methods: ['POST, GET, PUT, DELETE, OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'contentType', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar Rutas
var appRoutes = require('./routes/app');
var uploadRoutes = require('./routes/upload');
var dropzoneRoutes = require('./routes/dropzone');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var imagenesRoutes = require('./routes/imagenes');
var maniobraRoutes = require('./routes/maniobra');
var operadorRoutes = require('./routes/operador');
var camionRoutes = require('./routes/camiones');
var contenedorRoutes = require('./routes/contenedor');
var clienteRoutes = require('./routes/cliente');
var agenciaRoutes = require('./routes/agencia');
var fleteraRoutes = require('./routes/fletera');
var viajesRoutes = require('./routes/viaje');
var buqueRoutes = require('./routes/buque');
var navieraRoutes = require('./routes/naviera');
var buesquedaRoutes = require('./routes/busqueda');
var forgotpass = require('./routes/forgotpass');
var resetpass = require('./routes/resetpass');
var UploadFile = require('./routes/uploadfile');


// Conexión a la base de datos Mongoose
mongoose.connect('mongodb://myDbAdmin:reim*0348@192.168.2.253:27017/reim', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos Mongoose: \x1b[32m%s\x1b[0m', 'online');
})


// Rutas

app.use('/uploadFile', UploadFile)
app.use('/reset_password', resetpass)
app.use('/forgot_password', forgotpass)
app.use('/busqueda', buesquedaRoutes)
app.use('/naviera', navieraRoutes)
app.use('/buque', buqueRoutes)
app.use('/viaje', viajesRoutes)
app.use('/fletera', fleteraRoutes)
app.use('/agencia', agenciaRoutes)
app.use('/cliente', clienteRoutes)
app.use('/contenedor', contenedorRoutes)
app.use('/camion', camionRoutes)
app.use('/operador', operadorRoutes)
app.use('/maniobra', maniobraRoutes)
app.use('/img', imagenesRoutes)
app.use('/dropzone', dropzoneRoutes)
app.use('/upload', uploadRoutes)
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})