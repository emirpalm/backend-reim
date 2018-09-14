var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var aaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre de la agencia aduanal es necesario'] },
    rfc: { type: String, required: [true, 'El rfc es necesario'] },
    patente: { type: String, required: [true, 'La patente es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'agencias' });



module.exports = mongoose.model('Agencia', aaSchema);