var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var maniobraSchema = new Schema({
    entrada: { type: String, required: [true, 'La entrada es necesario'] },
    salida: { type: String, required: [false, 'La salida	es	necesario'] },
    operador: { type: String, required: [true, 'El operador es necesario'] },
    placas: { type: String, required: [true, 'Las placas son necesarias'] },
    fletera: { type: String, required: [true, 'La fletera es necesario'] },
    contenedor: { type: String, required: [true, 'EL contenedor es necesario'] },
    aa: { type: String, required: [true, 'La AA es necesario'] },
    cliente: { type: String, required: [true, 'EL cliente es necesario'] },
    inicio: { type: String, required: [false, 'El inicio es necesario'] },
    fin: { type: String, required: [false, 'El fin es necesario'] },
    carga: { type: Boolean, required: [false, 'La carga es necesario'] },
    desc: { type: Boolean, required: [false, 'La desc es necesario'] },
    lavado: { type: String, required: [false, 'La lavado es necesario'] },
    rep: { type: String, required: [false, 'La rep es necesario'] },
    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    grado: { type: String, required: [true, 'El grado es necesario'] },
    fechapublicado: { type: Date, required: [true, 'La fehca es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'maniobras' });

module.exports = mongoose.model('Maniobra', maniobraSchema);