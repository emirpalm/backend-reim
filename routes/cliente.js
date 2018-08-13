var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Cliente = require('../models/cliente');

// ==========================================
// Obtener todas los clientes
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cliente.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, cliente) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar clientes',
                        errors: err
                    });
                }

                Cliente.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        cliente: cliente,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Clientes por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Cliente.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, cliente) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el cliente',
                    errors: err
                });
            }

            if (!cliente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El cliente con el id ' + id + 'no existe',
                    errors: { message: 'No existe un cliente con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                cliente: cliente
            });
        })
})





// ==========================================
// Actualizar Cliente
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Cliente.findById(id, (err, cliente) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }

        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe',
                errors: { message: 'No existe cliente con ese ID' }
            });
        }


        cliente.cliente = body.cliente;
        cliente.usuario = req.usuario._id;

        cliente.save((err, clienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                cliente: clienteGuardado
            });

        });

    });

});



// ==========================================
// Crear nuevos clientes
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var cliente = new Cliente({
        cliente: body.cliente,
        usuario: req.usuario._id
    });

    cliente.save((err, clienteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            cliente: clienteGuardado
        });


    });

});


// ============================================
//   Borrar clientes por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar cliente',
                errors: err
            });
        }

        if (!clienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe cliente con ese id',
                errors: { message: 'No existe cliente con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            cliente: clienteBorrado
        });

    });

});


module.exports = app;