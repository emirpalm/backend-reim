var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var clienteSchema = new Schema({
    cliente: { type: String, required: [true, 'El cliente es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'clientes' });



module.exports = mongoose.model('Cliente', clienteSchema);