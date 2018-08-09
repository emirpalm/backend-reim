// Requires
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Maniobra = require('../models/maniobra');

// =======================================
// Obtener Maniobra
// =======================================
app.get('/', (req, res, netx) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Maniobra.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, maniobras) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando maniobras'
                    });
                }
                Maniobra.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        maniobras,
                        total: conteo
                    });

                })

            })
});

// =======================================
// Crear Maniobra
// =======================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var maniobra = new Maniobra({
        entrada: body.entrada,
        salida: body.salida,
        operador: body.operador,
        placas: body.placas,
        fletera: body.fletera,
        contenedor: body.contenedor,
        aa: body.aa,
        cliente: body.cliente,
        inicio: body.inicio,
        fin: body.fin,
        carga: body.carga,
        desc: body.desc,
        lavado: body.lavado,
        rep: body.rep,
        tipo: body.tipo,
        grado: body.grado,
        usuario: req.usuario._id

    });

    maniobra.save((err, maniobraGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear maniobra',
                errores: err
            });
        }
        res.status(201).json({
            ok: true,
            maniobra: maniobraGuardado
        });

    });

});

// =======================================
// Actualizar Maniobra
// =======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Maniobra.findById(id, (err, maniobra) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar maniobra',
                errores: err
            });
        }

        if (!maniobra) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La maniobra con el id ' + id + ' no existe',
                errores: { message: 'No existe una maniobra con ese ID' }
            });
        }

        maniobra.entrada = body.entrada,
            maniobra.salida = body.salida,
            maniobra.operador = body.operador,
            maniobra.placas = body.placas,
            maniobra.fletera = body.fletera,
            maniobra.contenedor = body.contenedor,
            maniobra.aa = body.aa,
            maniobra.cliente = body.cliente,
            maniobra.inicio = body.inicio,
            maniobra.fin = body.fin,
            maniobra.carga = body.carga,
            maniobra.desc = body.desc,
            maniobra.lavado = body.lavado,
            maniobra.rep = body.rep,
            maniobra.tipo = body.tipo,
            maniobra.grado = body.grado,
            maniobra.usuario = req.usuario._id;


        maniobra.save((err, maniobraGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la maniobra',
                    errores: err
                });
            }


            res.status(200).json({
                ok: true,
                maniobra: maniobraGuardado
            });
        });

    });

});

// =======================================
// Borrar Maniobra por id
// =======================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Maniobra.findByIdAndRemove(id, (err, maniobraBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar maniobra',
                errores: err
            });
        }

        if (!maniobraBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una maniobra con ese id',
                errores: { message: 'No existe una maniobra con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            maniobra: maniobraBorrado
        });
    });
});


// export
module.exports = app;