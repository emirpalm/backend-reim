var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vacioimportacionValidos = {
    values: ['Vacio', 'Importación'],
    message: '{VALUE} no esta permitido'
};

const subSchema = new Schema({
    contenedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Contenedor', required: true },
    vacioimportacion: { type: String, required: [true, 'Es necesario'] }

});

var viajeSchema = new Schema({
    viaje: { type: String, required: [true, 'El viaje es necesario'] },
    contenedores: [subSchema],
    fechaviaje: { type: Date, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, { collection: 'viajes' });



module.exports = mongoose.model('Viaje', viajeSchema);