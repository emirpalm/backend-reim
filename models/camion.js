var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var camionSchema = new Schema({
    placa: { type: String, required: [true, 'Las placas son necesarias'] },
    numbereconomico: { type: String, required: [true, 'El numero economico es necesario'] },
    fletera: {
        type: Schema.Types.ObjectId,
        ref: 'Fletera',
        required: [true, 'El id Fletera es un campo obligatorio ']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, { collection: 'camiones' });



module.exports = mongoose.model('Camion', camionSchema);