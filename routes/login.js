// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Inicializar variables
var app = express();

var Usuario = require('../models/usuario');

// ==========================================
//  Autenticación normal
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errores: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas = email',
                errores: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errores: err
            });
        }
        // Crear token
        usuarioDB.password = '=)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) // 4hrs

        res.status(200).json({

            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });
    });

    function obtenerMenu(ROLE) {

        var menu = [{
                titulo: 'Principal',
                icono: 'mdi mdi-gauge',
                submenu: [
                    { titulo: 'Dashboard', url: '/dashboard' },
                    { titulo: 'Maniobras', url: '/maniobras' }
                ]
            },
            {
                titulo: 'Mantenimientos',
                icono: 'mdi mdi-folder-lock-open',
                submenu: [
                    { titulo: 'Operadores', url: '/operadores' },
                    { titulo: 'Placas', url: '/placas' },
                    { titulo: 'Contenedores', url: '/contenedores' },
                    { titulo: 'Clientes', url: '/clientes' }
                ]
            }
        ];

        console.log('ROLE', ROLE);

        if (ROLE === 'ADMIN_ROLE') {
            menu[1].submenu.unshift({ titulo: 'Registrar Usuarios', url: '/register' });
            menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
        }


        return menu;

    }

});

// export
module.exports = app;