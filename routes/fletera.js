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
    var role = 'TRANSPORTISTA_ROLE';

    Fletera.find({ role: role })
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

                Fletera.countDocuments({ role: role }, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        fletera: fletera,
                        total: conteo
                    });
                })

            });
});

// ==========================================
// Obtener Fleteras por ID
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

        fletera.cliente = body.cliente;
        fletera.razonSocial = body.razonSocial;
        fletera.rfc = body.rfc;
        fletera.calle = body.calle;
        fletera.numeroExterior = body.numeroExterior;
        fletera.numeroInterior = body.numeroInterior;
        fletera.colonia = body.colonia;
        fletera.municipioDelegacion = body.municipioDelegacion;
        fletera.ciudad = body.ciudad;
        fletera.estado = body.estado;
        fletera.cp = body.cp;
        fletera.correo = body.correo;
        fletera.correoFac = body.correoFac;
        fletera.credito = body.credito;
        fletera.patente = body.patente;
        fletera.nombreComercial = body.nombreComercial;
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
        cliente: body.cliente,
        razonSocial: body.razonSocial,
        rfc: body.rfc,
        calle: body.calle,
        numeroExterior: body.numeroExterior,
        numeroInterior: body.numeroInterior,
        colonia: body.colonia,
        municipioDelegacion: body.municipioDelegacion,
        ciudad: body.ciudad,
        estado: body.estado,
        cp: body.cp,
        correo: body.correo,
        correoFac: body.correoFac,
        credito: body.credito,
        patente: body.patente,
        nombreComercial: body.nombreComercial,
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