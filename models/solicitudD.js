var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var solicitudScheme = new Schema({
    agencia: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    naviera: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    transportista: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    facturarA: { type: String },
    buque: { type: Schema.Types.ObjectId, ref: 'Buque', required: true },
    viaje: { type: String },
    observaciones: { type: String },
    rutaBL: { type: String },
    credito: { type: Boolean, default: 'false' },
    rutaComprobante: { type: String },
    correo: { type: String, requiered: [true, 'EL correo es necesaria'] },
    correoFac: { type: String, requiered: [true, 'EL correo de factura es necesaria'] },
    contenedores: [{
        Contenedor: { type: String, unique: false, required: [true, 'El contenedor es necesario'] },
        Tipo: { type: String },
        Estado: { type: String },
        Maniobra: { type: String }
    }],
    fechaCreado: { type: Date, default: Date.now },
    fechaModificado: { type: Date },
    tipo: { type: String, default: 'D' },
    estatus: { type: String, default: 'NA' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'solicitudes' });

solicitudScheme.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Solicitud', solicitudScheme);