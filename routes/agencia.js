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
    var role = 'AA_ROLE';

    Agencia.find({ role: role })
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

                Agencia.countDocuments({ role: role }, (err, conteo) => {

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
        .populate('clientes', 'razonSocial')
        .populate('usuario', 'nombre email')
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
//  Obtener Agencias por ID de usuario
// ==========================================
app.get('/usuario/:id', (req, res) => {

    var id = req.params.id;

    Agencia.find({ usuarios: id })
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

        agencia.cliente = body.cliente;
        agencia.razonSocial = body.razonSocial;
        agencia.rfc = body.rfc;
        agencia.calle = body.calle;
        agencia.numeroExterior = body.numeroExterior;
        agencia.numeroInterior = body.numeroInterior;
        agencia.colonia = body.colonia;
        agencia.municipioDelegacion = body.municipioDelegacion;
        agencia.ciudad = body.ciudad;
        agencia.estado = body.estado;
        agencia.cp = body.cp;
        agencia.correo = body.correo;
        agencia.correoFac = body.correoFac;
        agencia.credito = body.credito;
        agencia.patente = body.patente;
        agencia.nombreComercial = body.nombreComercial;
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