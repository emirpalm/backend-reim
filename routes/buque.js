var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Buque = require('../models/buque');

// ==========================================
// Obtener todas los buques
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Buque.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, buque) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar clientes',
                        errors: err
                    });
                }

                Buque.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        buque: buque,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Buques por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Buque.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, buque) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el buque',
                    errors: err
                });
            }

            if (!buque) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El buque con el id ' + id + 'no existe',
                    errors: { message: 'No existe un buque con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                buque: buque
            });
        })
})





// ==========================================
// Actualizar Buque
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Buque.findById(id, (err, buque) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar buque',
                errors: err
            });
        }

        if (!buque) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El buque con el id ' + id + ' no existe',
                errors: { message: 'No existe buque con ese ID' }
            });
        }


        buque.buque = body.buque;
        buque.usuario = req.usuario._id;

        buque.save((err, buqueGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar buque',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                buque: buqueGuardado
            });

        });

    });

});



// ==========================================
// Crear nuevos buques
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var buque = new Buque({
        buque: body.buque,
        usuario: req.usuario._id
    });

    buque.save((err, buqueGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear buque',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            buque: buqueGuardado
        });


    });

});


// ============================================
//   Borrar buques por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Buque.findByIdAndRemove(id, (err, buqueBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar buque',
                errors: err
            });
        }

        if (!buqueBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe buque con ese id',
                errors: { message: 'No existe buque con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            buque: buqueBorrado
        });

    });

});


module.exports = app;