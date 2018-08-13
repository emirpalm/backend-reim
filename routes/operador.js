var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Operador = require('../models/operador');

// ==========================================
// Obtener todos los Operador
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Operador.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, operadores) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando operador',
                        errors: err
                    });
                }

                Operador.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        operadores: operadores,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Operador por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Operador.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, operadores) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar al operador',
                    errors: err
                });
            }

            if (!operadores) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El operador con el id ' + id + 'no existe',
                    errors: { message: 'No existe un operador con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                operadores: operadores
            });
        })
})





// ==========================================
// Actualizar Operador
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Operador.findById(id, (err, operador) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar al operador',
                errors: err
            });
        }

        if (!operador) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El operador con el id ' + id + ' no existe',
                errors: { message: 'No existe un operador con ese ID' }
            });
        }


        operador.operador = body.operador;
        operador.usuario = req.usuario._id;

        operador.save((err, operadorGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar al operador',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                operador: operadorGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo operador
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var operador = new Operador({
        operador: body.operador,
        usuario: req.usuario._id
    });

    operador.save((err, operadorGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear operador',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            operador: operadorGuardado
        });


    });

});


// ============================================
//   Borrar un operador por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Operador.findByIdAndRemove(id, (err, operadorBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el operador',
                errors: err
            });
        }

        if (!operadorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un operador con ese id',
                errors: { message: 'No existe un operador con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            operador: operadorBorrado
        });

    });

});


module.exports = app;