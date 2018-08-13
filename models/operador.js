var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var operadorSchema = new Schema({
    operador: { type: String, required: [true, 'El nombre del operador es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'operadores' });



module.exports = mongoose.model('Operador', operadorSchema);