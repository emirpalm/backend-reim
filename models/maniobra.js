var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var transporteValidos = {
    values: ['Carga', 'Descarga'],
    message: '{VALUE} no es un transporte permitido'
};


var maniobraSchema = new Schema({
    entrada: { type: String, required: [true, 'La entrada es necesario'] },
    salida: { type: String, required: [false, 'La salida es	necesario'] },
    fletera: { type: String, required: [true, 'La fletera es necesario'] },
    aa: { type: String, required: [true, 'La AA es necesario'] },
    inicio: { type: String, required: [false, 'El inicio es necesario'] },
    fin: { type: String, required: [false, 'El fin es necesario'] },
    transporte: { type: String, required: true, default: 'Carga', enum: transporteValidos },
    lavado: { type: String, required: [false, 'La lavado es necesario'] },
    rep: { type: String, required: [false, 'La rep es necesario'] },
    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    grado: { type: String, required: [true, 'El grado es necesario'] },
    fechaCreado: { type: Date },
    fechaModificado: { type: Date },
    operador: {
        type: Schema.Types.ObjectId,
        ref: 'Operador',
        required: [true, 'El id operador es un campo obligatorio ']
    },
    placas: {
        type: Schema.Types.ObjectId,
        ref: 'Placa',
        required: [true, 'El id placas es un campo obligatorio ']
    },
    contenedor: {
        type: Schema.Types.ObjectId,
        ref: 'Contenedor',
        required: [true, 'El id contenedor es un campo obligatorio ']
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'El id Cliente es un campo obligatorio ']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, { collection: 'maniobras' });

module.exports = mongoose.model('Maniobra', maniobraSchema);