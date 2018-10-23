var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var camionSchema = new Schema({
    placa: { type: String, unique: true, required: [true, 'Las placas son necesarias'] },
    numbereconomico: { type: String, required: [true, 'El numero economico es necesario'] },
    fletera: {
        type: Schema.Types.ObjectId,
        ref: 'Fletera',
        required: [true, 'El id Fletera es un campo obligatorio ']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, { collection: 'camiones' });

camionSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Camion', camionSchema);