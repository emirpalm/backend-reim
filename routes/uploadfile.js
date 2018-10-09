// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var csv = require('fast-csv');
var mdAutenticacion = require('../middlewares/autenticacion');
var fs = require('fs');

// Inicializar variables
var app = express();

// Models
var Viaje = require('../models/viajes');

// default options
app.use(fileUpload());

app.put('/', mdAutenticacion.verificaToken, (req, res) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar un csv' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.csv;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['csv'];

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
    var path = './uploads/' + nombreArchivo;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }


        fs.exists(path, function(exists) {
            if (exists) {
                var stream = fs.createReadStream(path);

                csv.fromStream(stream, {
                    headers: [
                        'viaje',
                        'buque',
                        'contenedor',
                        'tipo',
                        'vacioimportacion'
                    ]
                }).on("data", function(data) {
                    var viaje = new Viaje();
                    viaje.viaje = data['viaje'];
                    viaje.buque = data['buque'];
                    viaje.contenedor = data['contenedor'];
                    viaje.tipo = data['tipo'];
                    viaje.vacioimportacion = data['vacioimportacion'];
                    viaje.usuario = req.usuario._id;

                    viaje.save(function(err, data) {
                        if (err) console.log(err);
                        else {
                            console.log('Saved ', data);
                        }
                    });

                })

            }
        });


    })



});

module.exports = app;