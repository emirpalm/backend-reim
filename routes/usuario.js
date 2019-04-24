// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Usuario = require('../models/usuario');

// =======================================
// Obtener Usuarios
// =======================================
app.get('/', async(req, res, netx) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    try {
        await Usuario.find({}, 'nombre email img role empresas')
            .skip(desde)
            .populate('empresas', 'razonSocial')
            .limit(5)
            .exec(
                (err, usuarios) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando usuario',
                            errors: err
                        });
                    }
                    Usuario.countDocuments({}, (err, conteo) => {
                        res.status(200).json({
                            ok: true,
                            usuarios,
                            total: conteo
                        });

                    });

                });
    } catch (err) {
        return res.status(500).send(err);
    }
});

// ==========================================
//  Obtener usuario por ID
// ==========================================
app.get('/:id', async(req, res) => {

    var id = req.params.id;
    try {
        await Usuario.findById(id, 'empresas')
            .populate('empresas', 'razonSocial')
            .exec((err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuario',
                        errors: err
                    });
                }

                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'La usuario con el id ' + id + 'no existe',
                        errors: { message: 'No existe un usuario con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuario: usuario
                });
            });
    } catch (err) {
        return res.status(500).send(err);
    }
});



// =======================================
// Actualizar Usuarios
// =======================================
app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario], async(req, res) => {
    var id = req.params.id;
    var body = req.body;
    try {
        await Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + ' no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;
            usuario.empresas = body.empresas;

            usuario.save((err, usuarioGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }

                usuarioGuardado.password = '=)';

                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado
                });
            });

        });
    } catch (err) {
        return res.status(500).send(err);
    }

});



// =======================================
// Crear Usuarios
// =======================================

app.post('/', async(req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        empresas: body.empresas
    });
    try {
        await usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = '=)';
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });

        });
    } catch (err) {
        return res.status(500).send(err);
    }

});

// =======================================
// Borrar Usuarios
// =======================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], async(req, res) => {
    var id = req.params.id;
    try {
        await Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar usuario',
                    errors: err
                });
            }

            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese id',
                    errors: { message: 'No existe un usuario con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
        });
    } catch (err) {
        return res.status(500).send(err);
    }
});

// export
module.exports = app;