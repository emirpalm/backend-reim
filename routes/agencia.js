var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Agencia = require('../models/agencia');

// ==========================================
// Obtener todas las agencias aduanales
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Agencia.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, agencia) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar agencias',
                        errors: err
                    });
                }

                Agencia.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        agencia: agencia,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Agencias por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Agencia.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, agencia) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar agencias',
                    errors: err
                });
            }

            if (!agencia) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La agencia con el id ' + id + 'no existe',
                    errors: { message: 'No existe una agencia con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                agencia: agencia
            });
        })
})





// ==========================================
// Actualizar Agencias
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Agencia.findById(id, (err, agencia) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar agencia',
                errors: err
            });
        }

        if (!agencia) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La agencia con el id ' + id + ' no existe',
                errors: { message: 'No existe agencia con ese ID' }
            });
        }


        agencia.nombre = body.nombre;
        agencia.rfc = body.rfc;
        agencia.patente = body.patente;
        agencia.usuario = req.usuario._id;

        agencia.save((err, agenciaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar agencia',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                agencia: agenciaGuardado
            });

        });

    });

});



// ==========================================
// Crear nuevos clientes
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var agencia = new Agencia({
        nombre: body.nombre,
        rfc: body.rfc,
        patente: body.patente,
        usuario: req.usuario._id
    });

    agencia.save((err, agenciaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear agencia',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            agencia: agenciaGuardado
        });


    });

});


// ============================================
//   Borrar agencias por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Agencia.findByIdAndRemove(id, (err, agenciaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar agencia',
                errors: err
            });
        }

        if (!agenciaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe agencia con ese id',
                errors: { message: 'No existe agencia con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            agencia: agenciaBorrado
        });

    });

});


module.exports = app;