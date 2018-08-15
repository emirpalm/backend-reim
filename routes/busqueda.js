var express = require('express');

var app = express();

var Usuario = require('../models/usuario');
var Placa = require('../models/placas');
var Operador = require('../models/operador');
var Contenedor = require('../models/contenedor');
var Cliente = require('../models/cliente');
var Maniobra = require('../models/maniobra');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'operadores':
            promesa = buscarOperadores(busqueda, regex);
            break;

        case 'placas':
            promesa = buscarPlacas(busqueda, regex);
            break;

        case 'contenedores':
            promesa = buscarContenedores(busqueda, regex);
            break;

        case 'clientes':
            promesa = buscarClientes(busqueda, regex);
            break;

        case 'maniobras':
            promesa = buscarManiobras(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, operadores, placas, contenedores, clientes, maniobras',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarOperadores(busqueda, regex),
            buscarPlacas(busqueda, regex),
            buscarContenedores(busqueda, regex),
            buscarClientes(busqueda, regex),
            buscarManiobras(busqueda, regex),
            buscarUsuarios(busqueda, regex)

        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                operadores: respuestas[0],
                placas: respuestas[1],
                contenedores: respuestas[2],
                clientes: respuestas[3],
                maniobras: respuestas[4],
                usuarios: respuestas[5]
            });
        })


});


function buscarOperadores(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Operador.find({ operador: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, operador) => {

                if (err) {
                    reject('Error al cargar operadores', err);
                } else {
                    resolve(operador)
                }
            });
    });
}

function buscarPlacas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Placa.find({ placa: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, placas) => {

                if (err) {
                    reject('Error al cargar placas', err);
                } else {
                    resolve(placas)
                }
            });
    });
}

function buscarContenedores(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Contenedor.find({ contenedor: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, contenedor) => {

                if (err) {
                    reject('Error al cargar contenedores', err);
                } else {
                    resolve(contenedor)
                }
            });
    });
}

function buscarClientes(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Cliente.find({ cliente: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, clientes) => {

                if (err) {
                    reject('Error al cargar clientes', err);
                } else {
                    resolve(clientes)
                }
            });
    });
}

function buscarManiobras(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Maniobra.find({ maniobra: regex })
            .populate('operador', 'operador')
            .populate('placas', 'placas')
            .populate('contenedor', 'contenedor')
            .populate('cliente', 'cliente')
            .populate('usuario', 'nombre email')
            .exec((err, maniobra) => {

                if (err) {
                    reject('Error al cargar maniobras', err);
                } else {
                    resolve(maniobra)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}



module.exports = app;