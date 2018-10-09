var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var navieraSchema = new Schema({
    naviera: { type: String, required: [true, 'El nombre es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'navieras' });


module.exports = mongoose.model('Naviera', navieraSchema);