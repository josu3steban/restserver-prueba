const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    descripcion: { 
        type: String, 
        unique: true, 
        required: [true, 'La descripción es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    }
    
});

categoriaSchema.plugin( uniqueValidator, { message: '{PATH} DEBE DE SER ÚNICO'});

module.exports = mongoose.model('Categoria', categoriaSchema);