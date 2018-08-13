var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Placa = require('../models/placas');

// ==========================================
// Obtener todas las Placas
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Placa.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, placas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar placas',
                        errors: err
                    });
                }

                Placa.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        placas: placas,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Placas por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Placa.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, placas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la placa',
                    errors: err
                });
            }

            if (!placas) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La placa con el id ' + id + 'no existe',
                    errors: { message: 'No existe una placa con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                placas: placas
            });
        })
})





// ==========================================
// Actualizar Placa
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Placa.findById(id, (err, placas) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar placas',
                errors: err
            });
        }

        if (!placas) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Las placas con el id ' + id + ' no existe',
                errors: { message: 'No existe placas con ese ID' }
            });
        }


        placas.placa = body.placa;
        placas.usuario = req.usuario._id;

        placas.save((err, placaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar placas',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                placas: placaGuardado
            });

        });

    });

});



// ==========================================
// Crear nuevas placas
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var placa = new Placa({
        placa: body.placa,
        usuario: req.usuario._id
    });

    placa.save((err, placaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear placas',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            placa: placaGuardado
        });


    });

});


// ============================================
//   Borrar placas por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Placa.findByIdAndRemove(id, (err, placaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar placa',
                errors: err
            });
        }

        if (!placaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe placas con ese id',
                errors: { message: 'No existe placas con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            placa: placaBorrado
        });

    });

});


module.exports = app;