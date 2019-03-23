var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Scheme = mongoose.Schema;

var prealtaScheme = new Scheme({
    // folio: { type: String, required: [true, 'El folio es necesario'] },
    agencia: { type: String, required: false },
    naviera: { type: String, required: [true, 'La naviera es necesaria'] },
    transportista: { type: String, required: [true, 'La fletera es necesaria'] },
    facturarA: { type: String, required: [true, 'Aquien factura es necesario'] },
    comprobantePago: { type: String },
    credito: { type: String },
    contenedores: { type: Array, "default": [] },
    observaciones: { type: String },
    correo: { type: String },
    correoFac: { type: String },
    folioAprobacion: { type: Boolean, default: 'false' }
}, { collection: 'maniobras' });

prealtaScheme.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Prealta', prealtaScheme);