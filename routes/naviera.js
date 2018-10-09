var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Naviera = require('../models/naviera');

// ==========================================
// Obtener todas las navieras
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Naviera.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, naviera) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar navieras',
                        errors: err
                    });
                }

                Naviera.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        naviera: naviera,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Naviera por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Naviera.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, naviera) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la naviera',
                    errors: err
                });
            }

            if (!naviera) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La naviera con el id ' + id + 'no existe',
                    errors: { message: 'No existe una naviera con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                naviera: naviera
            });
        })
})





// ==========================================
// Actualizar Naviera
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Naviera.findById(id, (err, naviera) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar naviera',
                errors: err
            });
        }

        if (!naviera) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La naviera con el id ' + id + ' no existe',
                errors: { message: 'No existe una naviera con ese ID' }
            });
        }


        naviera.naviera = body.naviera;
        naviera.usuario = req.usuario._id;

        naviera.save((err, navieraGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar naviera',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                naviera: navieraGuardado
            });

        });

    });

});



// ==========================================
// Crear nuevas navieras
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var naviera = new Naviera({
        naviera: body.naviera,
        usuario: req.usuario._id
    });

    naviera.save((err, navieraGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear naviera',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            naviera: navieraGuardado
        });


    });

});


// ============================================
//   Borrar navieras por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Naviera.findByIdAndRemove(id, (err, navieraBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar naviera',
                errors: err
            });
        }

        if (!navieraBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe naviera con ese id',
                errors: { message: 'No existe naviera con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            naviera: navieraBorrado
        });

    });

});


module.exports = app;