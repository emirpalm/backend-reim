var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var fleteraSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre de la fletera es necesario'] },
    rfc: { type: String, unique: true, required: [true, 'El rfc de la fletera es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'fleteras' });

fleteraSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Fletera', fleteraSchema);