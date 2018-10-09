var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Viaje = require('../models/viajes');

// ==========================================
// Obtener todas los viajes
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Viaje.find({})
        .skip(desde)
        .limit(5)
        .populate('buque', 'buque')
        .populate('naviera', 'naviera')
        .populate('usuario', 'nombre email')
        .exec(
            (err, viaje) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar viajes',
                        errors: err
                    });
                }

                Viaje.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        viaje: viaje,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener viajes por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Viaje.findById(id)
        .populate('buque', 'buque')
        .populate('naviera', 'naviera')
        .populate('usuario', 'nombre email')
        .exec((err, viaje) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar viaje',
                    errors: err
                });
            }

            if (!viaje) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El viaje con el id ' + id + 'no existe',
                    errors: { message: 'No existe un viaje con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                viaje: viaje
            });
        })
})

// ==========================================
//  Obtener viajes por numero
// ==========================================
app.get('/numero/:viaje', (req, res) => {

    var viaje = req.params.viaje;

    Viaje.find({ viaje: viaje })
        .populate('buque', 'buque')
        .populate('naviera', 'naviera')
        .populate('usuario', 'nombre img email')
        .exec((err, viaje) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar viaje',
                    errors: err
                });
            }

            if (!viaje) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El viaje con el numero' + viaje + 'no existe',
                    errors: { message: 'No existe un viaje con ese Numero' }
                });
            }
            res.status(200).json({
                ok: true,
                viaje: viaje
            });
        })
})





// ==========================================
// Actualizar Viaje
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Viaje.findById(id, (err, viaje) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar viaje',
                errors: err
            });
        }

        if (!viaje) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El viaje con el id ' + id + ' no existe',
                errors: { message: 'No existe viaje con ese ID' }
            });
        }


        viaje.viaje = body.viaje;
        viaje.buque = body.buque;
        viaje.naviera = body.naviera;
        viaje.contenedor = body.contenedor;
        viaje.tipo = body.tipo;
        viaje.vacioimportacion = body.vacioimportacion,
            viaje.usuario = req.usuario._id;

        viaje.save((err, viajeGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar viaje',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                viaje: viajeGuardado
            });

        });

    });

});



// ==========================================
// Crear nuevos viajes
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var viaje = new Viaje({
        viaje: body.viaje,
        buque: body.buque,
        naviera: body.naviera,
        contenedor: body.contenedor,
        tipo: body.tipo,
        vacioimportacion: body.vacioimportacion,
        usuario: req.usuario._id
    });

    viaje.save((err, viajeGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear viaje',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            viaje: viajeGuardado
        });


    });

});


// ============================================
//   Borrar viaje por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Viaje.findByIdAndRemove(id, (err, viajeBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar viaje',
                errors: err
            });
        }

        if (!viajeBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe viaje con ese id',
                errors: { message: 'No existe viaje con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            viaje: viajeBorrado
        });

    });

});


module.exports = app;