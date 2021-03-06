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
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas = email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }
        // Crear token
        usuarioDB.password = '=)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4hrs

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });

    }).populate('empresas', 'razonSocial');


});

function obtenerMenu(ROLE) {

    console.log('ROLE', ROLE);

    if (ROLE === 'ADMIN_ROLE') {
        let menu = [{
                titulo: 'Principal',
                icono: 'mdi mdi-gauge',
                submenu: [
                    { titulo: 'Dashboard', url: '/dashboard' }
                ]
            },
            {
                titulo: 'Catálogos',
                icono: 'mdi mdi-folder-lock-open',
                submenu: [

                ]
            },
            {
                titulo: 'Agencia',
                icono: 'mdi mdi-folder-lock-open',
                submenu: [

                ]
            },
            {
                titulo: 'Naviera',
                icono: 'mdi mdi-folder-lock-open',
                submenu: [

                ]
            },
            {
                titulo: 'Transportista',
                icono: 'mdi mdi-folder-lock-open',
                submenu: [

                ]
            },
        ];
        menu[0].submenu.unshift({ titulo: 'Solicitudes de descargas', url: '/solicitudes_de_descarga' });
        menu[0].submenu.unshift({ titulo: 'Viajes', url: '/viajes' });
        menu[0].submenu.unshift({ titulo: 'Maniobras', url: '/maniobras' });

        menu[1].submenu.unshift({ titulo: 'Buques', url: '/buques' });
        menu[1].submenu.unshift({ titulo: 'Operadores', url: '/operadores' });
        menu[1].submenu.unshift({ titulo: 'Camiones', url: '/camiones' });
        menu[1].submenu.unshift({ titulo: 'Contenedores', url: '/contenedores' });
        menu[1].submenu.unshift({ titulo: 'Clientes', url: '/clientes' });
        menu[1].submenu.unshift({ titulo: 'Agencias', url: '/agencias' });
        menu[1].submenu.unshift({ titulo: 'Transportistas', url: '/fleteras' });
        menu[1].submenu.unshift({ titulo: 'Navieras', url: '/navieras' });
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
        menu[1].submenu.unshift({ titulo: 'Registrar Usuarios', url: '/register' });


        menu[2].submenu.unshift({ titulo: 'Solicitud de carga', url: '/aacarga' });
        menu[2].submenu.unshift({ titulo: 'Solicitud de descarga', url: '/solicitudes_descargas' });
        menu[2].submenu.unshift({ titulo: 'Reporte de contenedores reparación / lavado', url: '/reportesRL' });
        menu[2].submenu.unshift({ titulo: 'Contenedores en reparación / lavado', url: '/contenedoresRL' });
        menu[2].submenu.unshift({ titulo: 'Contenedores Disponibles', url: '/contenedoresDisponibles' });

        return menu;

    }
    if (ROLE === 'AA_ROLE') {
        let menu = [{
                titulo: 'Principal',
                icono: 'mdi mdi-gauge',
                submenu: [
                    { titulo: 'Dashboard', url: '/dashboard' }
                ]
            },
            {
                titulo: 'Agencia',
                icono: 'mdi mdi-folder-lock-open',
                submenu: [

                ]
            },
        ];

        menu[1].submenu.unshift({ titulo: 'Solicitud de carga', url: '/aacarga' });
        menu[1].submenu.unshift({ titulo: 'Solicitud de descarga', url: '/solicitudes_descargas' });
        menu[1].submenu.unshift({ titulo: 'Clientes', url: '/clientes' });

        return menu;
    }
    if (ROLE === 'NAVIERA_ROLE') {
        let menu = [{
                titulo: 'Principal',
                icono: 'mdi mdi-gauge',
                submenu: [
                    { titulo: 'Dashboard', url: '/dashboard' }
                ]
            },
            {
                titulo: 'Naviera',
                icono: 'mdi mdi-folder-lock-open',
                submenu: [

                ]
            },
        ];
        menu[1].submenu.unshift({ titulo: 'Buques', url: '/buques' });
        menu[1].submenu.unshift({ titulo: 'Reporte de contenedores reparación / lavado', url: '/reportesRL' });
        menu[1].submenu.unshift({ titulo: 'Contenedores en reparación / lavado', url: '/contenedoresRL' });
        menu[1].submenu.unshift({ titulo: 'Contenedores Disponibles', url: '/contenedoresDisponibles' });
        menu[1].submenu.unshift({ titulo: 'Viajes', url: '/viajes' });

        return menu;
    }
    if (ROLE === 'TRANSPORTISTA_ROLE') {
        let menu = [{
                titulo: 'Principal',
                icono: 'mdi mdi-gauge',
                submenu: [
                    { titulo: 'Dashboard', url: '/dashboard' }
                ]
            },
            {
                titulo: 'Transportista',
                icono: 'mdi mdi-folder-lock-open',
                submenu: [

                ]
            },
        ];
        menu[1].submenu.unshift({ titulo: 'Operadores', url: '/operadores' });
        menu[1].submenu.unshift({ titulo: 'Camiones', url: '/camiones' });

        return menu;
    }

}

// export
module.exports = app;