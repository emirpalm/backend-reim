var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var maniobraSchema = new Schema({
    entrada: { type: String, required: [true, 'La entrada es necesario'] },
    salida: { type: String, required: [true, 'La salida	es	necesario'] },
    operador: { type: String, required: [true, 'El operador es necesario'] },
    placas: { type: String, required: [true, 'Las placas son necesarias'] },
    fletera: { type: String, required: [true, 'La fletera es necesario'] },
    contenedor: { type: String, required: [true, 'EL contenedor es necesario'] },
    aa: { type: String, required: [true, 'La AA es necesario'] },
    cliente: { type: String, required: [true, 'EL cliente es necesario'] },
    inicio: { type: String, required: [true, 'El inicio es necesario'] },
    fin: { type: String, required: [true, 'El fin es necesario'] },
    carga: { type: Boolean, required: [true, 'La carga es necesario'] },
    desc: { type: Boolean, required: [true, 'La desc es necesario'] },
    lavado: { type: String, required: [true, 'La lavado es necesario'] },
    rep: { type: String, required: [true, 'La rep es necesario'] },
    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    grado: { type: String, required: [true, 'El grado es necesario'] },
    pdf: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'maniobras' });

module.exports = mongoose.model('Maniobra', maniobraSchema);