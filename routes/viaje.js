var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Viaje = require('../models/viajes');
var Prealta = require('../models/prealtamaniobra');

// default options
app.use(fileUpload());

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
        .populate('contenedores.cliente', 'razonSocial')
        // .populate('contenedores.contenedor')
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
                });

            });
});

// ==========================================
//  Obtener viajes por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Viaje.findById(id)
        .populate('buque', 'buque')
        .populate('contenedores.cliente', 'razonSocial')
        // .populate('naviera', 'naviera')
        // .populate('contenedores.contenedor')
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
        });
});

// ==========================================
//  Obtener viajes por numero
// ==========================================
app.get('/numero/:viaje', (req, res) => {

    var viaje = req.params.viaje;

    Viaje.find({ 'viaje': viaje })
        .populate('buque', 'buque')
        .populate('naviera', 'naviera')
        .populate('contenedores.contenedor')
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
                    mensaje: 'El viaje con el numero' + viaje + 'no existe',
                    errors: { message: 'No existe un viaje con ese Numero' }
                });
            }
            res.status(200).json({
                ok: true,
                viaje: viaje
            });
        });
});



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
// Añadir contenedores del viaje
// ==========================================
app.put('/add/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var contenedor = { "contenedor": body.contenedor, "vacioimportacion": body.vacioimportacion };

    Viaje.findByIdAndUpdate(id, { $push: { contenedores: contenedor } }, (err, viaje) => {


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
        } else {
            res.status(201).json({
                ok: true,
                viaje: viaje
            });
        }
    });

});

// ==========================================
// Remover contenedores del viaje
// ==========================================
app.put('/remove/:id&:contenedor', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var contenedor = { "contenedor": req.params.contenedor };

    Viaje.findByIdAndUpdate(id, { $pull: { contenedores: contenedor } }, (err, viaje) => {


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
        } else {
            res.status(201).json({
                ok: true,
                viaje: viaje
            });
        }
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
        fechaArrivo: body.fechaArrivo,
        fechaVigenciaTemporal: body.fechaVigenciaTemporal,
        contenedores: body.contenedores,
        pdfTemporal: body.pdfTemporal,
        usuario: req.usuario._id
    });

    // console.log(viaje);
    /* if (fs.exists('./uploads/temp/' + viaje.pdfTemporal)) {
         fs.rename('./uploads/temp/' + viaje.pdfTemporal, './uploads/viajes/' + viaje.pdfTemporal, (err) => {
             if (err) { console.log(err); }
         });
     }*/
    //  viaje.pdfTemporal = Viaje.pdfTemporal;

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

        viaje.contenedores.forEach(function(element) {
            var prealta;

            if (element.Estado == 'VACIO') {
                prealta = new Prealta({
                    viaje: viaje._id,
                    transportista: 'REIM',
                    facturarA: element.Cliente,
                    correoFac: 'dad',
                    contenedor: element.Contenedor,
                    tipo: element.Tipo,
                    estado: element.Estado,
                    destinatario: element.Cliente,
                    estatus: 'EN ESPERA',
                    usuario: req.usuario._id
                });
            } else {
                prealta = new Prealta({
                    viaje: viaje._id,
                    correoFac: 'dad',
                    contenedor: element.Contenedor,
                    tipo: element.Tipo,
                    estado: element.Estado,
                    destinatario: element.Cliente,
                    usuario: req.usuario._id
                });

            }
            // console.log(element);
            // console.log(prealta);

            prealta.save((err, prealtaGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear prealta',
                        errors: err
                    });
                }


            });


        });

    });


});




// ============================================
// Borrar viaje por el id
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