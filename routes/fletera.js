var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Fletera = require('../models/fletera');

// ==========================================
// Obtener todas los fleteras
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Fletera.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, fletera) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar fleteras',
                        errors: err
                    });
                }

                Fletera.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        fletera: fletera,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Fleteras por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Fletera.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, fletera) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar fletera',
                    errors: err
                });
            }

            if (!fletera) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La fletera con el id ' + id + 'no existe',
                    errors: { message: 'No existe un fletera con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                fletera: fletera
            });
        })
})





// ==========================================
// Actualizar Fletera
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Fletera.findById(id, (err, fletera) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar fletera',
                errors: err
            });
        }

        if (!fletera) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La fletera con el id ' + id + ' no existe',
                errors: { message: 'No existe fletera con ese ID' }
            });
        }


        fletera.nombre = body.nombre;
        fletera.rfc = body.rfc;
        fletera.usuario = req.usuario._id;

        fletera.save((err, fleteraGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar fletera',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                fletera: fleteraGuardado
            });

        });

    });

});



// ==========================================
// Crear nuevas fleteras
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var fletera = new Fletera({
        nombre: body.nombre,
        rfc: body.rfc,
        usuario: req.usuario._id
    });

    fletera.save((err, fleteraGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear fletera',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            fletera: fleteraGuardado
        });


    });

});


// ============================================
//   Borrar fleteras por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Fletera.findByIdAndRemove(id, (err, fleteraBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar fletera',
                errors: err
            });
        }

        if (!fleteraBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe fletera con ese id',
                errors: { message: 'No existe fletera con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            fletera: fleteraBorrado
        });

    });

});


module.exports = app;