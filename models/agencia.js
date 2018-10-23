var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var aaSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre de la agencia aduanal es necesario'] },
    rfc: { type: String, unique: true, required: [true, 'El rfc es necesario'] },
    patente: { type: String, required: [true, 'La patente es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'agencias' });

aaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Agencia', aaSchema);