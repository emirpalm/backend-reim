// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var mdAutenticacion = require('../middlewares/autenticacion');
var fs = require('fs');

// Inicializar variables
var app = express();

// default options
app.use(fileUpload());

app.put('/', (req, res) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar un csv' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.file;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['pdf'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    //files are put into upload folder.
    var path = './uploads/temp/' + nombreArchivo;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }


        //  subirPorTipo(tipo, id, nombreArchivo, res);

        res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido',
            nombreArchivo: nombreArchivo,
            path: path
        });


    });



});

module.exports = app;