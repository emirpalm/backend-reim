var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var buqueSchema = new Schema({
    buque: { type: String, required: [true, 'El nombre es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'buques' });


module.exports = mongoose.model('Buque', buqueSchema);