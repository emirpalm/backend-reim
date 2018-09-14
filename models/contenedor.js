var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var contenedorSchema = new Schema({
    contenedor: { type: String, required: [true, 'El contenedor es necesario'] },
    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'contenedores' });



module.exports = mongoose.model('Contenedor', contenedorSchema);