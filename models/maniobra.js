var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var transporteValidos = {
    values: ['Carga', 'Descarga'],
    message: '{VALUE} no es un transporte permitido'
};


var maniobraSchema = new Schema({
    entrada: { type: String, required: [true, 'La entrada es necesario'] },
    salida: { type: String },
    inicio: { type: String },
    fin: { type: String },
    transporte: { type: String, required: true, default: 'Carga', enum: transporteValidos },
    lavado: { type: String, required: [false, 'La lavado es necesario'] },
    rep: { type: String, required: [false, 'La rep es necesario'] },
    grado: { type: String, required: [true, 'El grado es necesario'] },
    imgfolder: { type: String, required: false },
    fechaCreado: { type: Date, default: Date.now },
    fechaModificado: { type: Date },
    operador: {
        type: Schema.Types.ObjectId,
        ref: 'Operador',
        required: [true, 'El id operador es un campo obligatorio ']
    },
    camiones: {
        type: Schema.Types.ObjectId,
        ref: 'Camion',
        required: [true, 'El id camiones es un campo obligatorio ']
    },
    contenedor: {
        type: String,
        required: [true, 'El id contenedor es un campo obligatorio ']
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'El id Cliente es un campo obligatorio ']
    },
    agencia: {
        type: Schema.Types.ObjectId,
        ref: 'Agencia',
        required: [true, 'El id Agencia es un campo obligatorio ']
    },
    viaje: {
        type: Schema.Types.ObjectId,
        ref: 'Viaje',
        required: [true, 'El id Viaje es un campo obligatorio ']
    },
    buque: {
        type: Schema.Types.ObjectId,
        ref: 'Buque',
        required: [true, 'El id Buque es un campo obligatorio ']
    },
    imgl: [{
        img: { type: String }
    }],
    imgr: [{
        img: { type: String }
    }],
    solicitudD: { type: Schema.Types.ObjectId, ref: 'Solicitud', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, { collection: 'maniobras' });

module.exports = mongoose.model('Maniobra', maniobraSchema);