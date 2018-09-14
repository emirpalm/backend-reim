var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var fleteraSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre de la fletera es necesario'] },
    rfc: { type: String, required: [true, 'El rfc de la fletera es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'fleteras' });



module.exports = mongoose.model('Fletera', fleteraSchema);