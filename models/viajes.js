var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vacioimportacionValidos = {
    values: ['Vacio', 'Importación'],
    message: '{VALUE} no esta permitido'
};


var viajeSchema = new Schema({
    viaje: { type: String, required: [true, 'El viaje es necesario'] },
    buque: { type: Schema.Types.ObjectId, ref: 'Buque', required: true },
    naviera: { type: Schema.Types.ObjectId, ref: 'Naviera', required: true },
    contenedor: { type: String, required: [true, 'El contenedor es necesario'] },
    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    vacioimportacion: { type: String, required: true, default: 'Vacio', enum: vacioimportacionValidos },
    fechaArrivo: { type: Date, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, { collection: 'viajes' });



module.exports = mongoose.model('Viaje', viajeSchema);