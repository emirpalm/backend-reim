var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placaSchema = new Schema({
    placa: { type: String, required: [true, 'Las placas son necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'placas' });



module.exports = mongoose.model('Placa', placaSchema);