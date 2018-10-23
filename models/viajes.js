var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var vacioimportacionValidos = {
    values: ['Vacio', 'Importación'],
    message: '{VALUE} no esta permitido'
};


var viajeSchema = new Schema({
    viaje: { type: String, unique: true, required: [true, 'El viaje es necesario'] },
    buque: { type: Schema.Types.ObjectId, ref: 'Buque', required: true },
    naviera: { type: Schema.Types.ObjectId, ref: 'Naviera', required: true },
    contenedores: [{
        contenedor: { type: Schema.Types.ObjectId, unique: true, ref: 'Contenedor' },
        vacioimportacion: { type: String, default: 'Vacio', enum: vacioimportacionValidos }
    }],
    fechaArrivo: { type: Date, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, { collection: 'viajes' });

viajeSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Viaje', viajeSchema);