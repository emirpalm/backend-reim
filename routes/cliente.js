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
    var role = 'CLIENT_ROLE';

    Cliente.find({ role: role })
        .skip(desde)
        .limit(5)
        .populate('empresas', 'razonSocial')
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

                Cliente.countDocuments({ role: role }, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        cliente: cliente,
                        total: conteo
                    });
                })

            });
});

// ==========================================
// Obtener todas los clientes por role
// ==========================================
app.get('/role/:role', (req, res) => {
    var role = req.params.role;

    Cliente.find({ role })
        .populate('usuario', 'nombre email')
        .exec((err, cliente) => {
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
                    mensaje: 'El cliente con el role' + role + 'no existe',
                    errors: { message: "No existe un cliente con ese role" }
                });
            }
            res.status(200).json({
                ok: true,
                cliente: cliente
            });

        });
});

// ==========================================
// Obtener Clientes por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Cliente.findById(id)
        .populate('usuario', 'nombre email')
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
// Obtener todas los clientes por id empresas
// ==========================================

app.get('/empresa/:id', (req, res) => {

    var id = req.params.id;

    Cliente.find({ empresas: id })
        .populate('usuario', 'nombre email')
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
        cliente.razonSocial = body.razonSocial;
        cliente.rfc = body.rfc;
        cliente.calle = body.calle;
        cliente.numeroExterior = body.numeroExterior;
        cliente.numeroInterior = body.numeroInterior;
        cliente.colonia = body.colonia;
        cliente.municipioDelegacion = body.municipioDelegacion;
        cliente.ciudad = body.ciudad;
        cliente.estado = body.estado;
        cliente.cp = body.cp;
        cliente.correo = body.correo;
        cliente.correoFac = body.correoFac;
        cliente.credito = body.credito;
        cliente.empresas = body.empresas;
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
        empresas: body.empresas,
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