// Requires
var express = require('express');

var mdAutentication = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Prealta = require('../models/prealtamaniobra');

// =======================================
// Obtener todas las prealtas
// =======================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Prealta.find({}, 'folio agencia naviera contenedor tipoContenedor transportista facturarA comprobantePago credito reparacion lavado observaciones folioAprobacion')
        .skip(desde)
        .limit(5)
        .exec(
            (err, prealtas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar datos',
                        errors: err
                    });
                }

                Prealta.countDocuments((err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        prealtas,
                        total: conteo
                    });
                });
            });
});

// ==========================================
//  Obtener prealta por id
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Prealta.findById(id)
        .exec((err, prealta) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar datos',
                    errors: err
                });
            }

            if (!prealta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La Prealta con el id' + id + ' no existe',
                    errors: { message: 'No existe una prealta con ese ID' }

                });
            }
            res.status(200).json({
                ok: true,
                prealta: prealta
            });
        });
});

// ==========================================
// Actualizar prealtas
// ==========================================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Prealta.findById(id, (err, prealta) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar datos',
                errors: err
            });
        }
        if (!prealta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La prealta con el id' + id + ' no existe',
                errors: { message: 'No existe prealta con ese ID' }
            });
        }
        prealta.folio = body.folio;
        prealta.agencia = body.agencia;
        prealta.naviera = body.naviera;
        prealta.transportista = body.transportista;
        prealta.facturarA = body.facturarA;
        prealta.credito = body.credito;
        prealta.contenedor = body.contenedor;
        prealta.tipoContenedor = body.tipoContenedor;
        prealta.estado = body.estado;
        prealta.reparacion = body.reparacion;
        prealta.lavado = body.lavado;
        prealta.servicio = body.servicio;
        prealta.observaciones = body.observaciones;

        prealta.save((err, prealtaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actulizar prealta',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                prealta: prealtaGuardado
            });
        });


    });
});

// ==========================================
// Crear nuevos prealtas
// ==========================================
app.post('/', mdAutentication.verificaToken, (req, res) => {
    var body = req.body;

    var prealta = new Prealta({
        folio: body.folio,
        agencia: body.agencia,
        naviera: body.naviera,
        transportista: body.transportista,
        facturarA: body.facturarA,
        credito: body.credito,
        contenedores: body.contenedores,
        observaciones: body.observaciones,
        correo: body.correo,
        correofac: body.correofac
    });

    prealta.save((err, prealtaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear prealta',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            prealta: prealtaGuardado
        });
    });
});

// ============================================
// Borrar prealta por el id
// ============================================
app.delete('/id:', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;

    Prealta.findByIdAndRemove(id, (err, prealtaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar la prealta',
                errors: err
            });
        }

        if (!prealta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe prealta con ese id',
                errors: { message: 'No existe prealta con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            prealta: prealtaBorrado
        });
    });
});

module.exports = app;