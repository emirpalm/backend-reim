var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Camion = require('../models/camion');

// ==========================================
// Obtener todos los camiones
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Camion.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, camiones) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar camiones',
                        errors: err
                    });
                }

                Camion.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        camiones: camiones,
                        total: conteo
                    });
                });

            });
});

// ==========================================
//  Obtener Camiones por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Camion.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, camiones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el camion',
                    errors: err
                });
            }

            if (!camiones) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'el camion con el id ' + id + 'no existe',
                    errors: { message: 'No existe un camion con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                camiones: camiones
            });
        });
});





// ==========================================
// Actualizar Camion
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Camion.findById(id, (err, camiones) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar camiones',
                errors: err
            });
        }

        if (!camiones) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Las camiones con el id ' + id + ' no existe',
                errors: { message: 'No existe camiones con ese ID' }
            });
        }


        camiones.placa = body.placa;
        camiones.numbereconomico = body.numbereconomico;
        camiones.vigenciaSeguro = body.vigenciaSeguro;
        camiones.usuario = req.usuario._id;

        camiones.save((err, camionGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar camiones',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                camiones: camionGuardado
            });

        });

    });

});



// ==========================================
// Crear nuevos camiones
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var camion = new Camion({
        placa: body.placa,
        numbereconomico: body.numbereconomico,
        vigenciaSeguro: body.vigenciaSeguro,
        usuario: req.usuario._id
    });

    camion.save((err, camionGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear camiones',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            camion: camionGuardado
        });


    });

});


// ============================================
//   Borrar camiones por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Camion.findByIdAndRemove(id, (err, camionBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar camion',
                errors: err
            });
        }

        if (!camionBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe camiones con ese id',
                errors: { message: 'No existe camiones con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            camion: camionBorrado
        });

    });

});


module.exports = app;