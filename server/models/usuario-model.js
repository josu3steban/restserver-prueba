const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} NO ES UN ROL VALIDO'
}

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'EL nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'EL email es necesario']
    },
    password: {
        type: String,
        required: [true, 'EL password es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        //required: [true, 'EL email es necesario']
        default: 'USER_ROL',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        //required: [true, 'EL email es necesario']
        default: true
    },
    google: {
        type: Boolean,
        //required: [true, 'EL email es necesario']
        default: false
    }
    
});

usuarioSchema.methods.toJSON = function() {

    let user = this;

    let userObjetc = user.toObject();
    delete userObjetc.password;

    return userObjetc;
}

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} DEBE DE SER ÚNICO'});

module.exports = mongoose.model('Usuario', usuarioSchema);