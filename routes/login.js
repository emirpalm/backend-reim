// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Usuario = require('../models/usuario');

// ==========================================
//  Renovar De Token
// ==========================================
app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4 horas

    res.status(200).json({
        ok: true,
        token: token
    });

});

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

    })


});

function obtenerMenu(ROLE) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Viajes', url: '/viajes' },
                { titulo: 'Maniobras', url: '/maniobras' }
            ]
        },
        {
            titulo: 'Catálogos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                { titulo: 'Operadores', url: '/operadores' },
                { titulo: 'Camiones', url: '/camiones' },
                { titulo: 'Contenedores', url: '/contenedores' },
                { titulo: 'Clientes', url: '/clientes' },
                { titulo: 'Agencias', url: '/agencias' },
                { titulo: 'Fleteras', url: '/fleteras' }
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

// export
module.exports = app;