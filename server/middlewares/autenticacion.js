const { json } = require('express');
const jwt = require('jsonwebtoken');

let verifica = ( req, res, next ) => {

    let token = req.get('auth');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
        
    });
    
};

let verificaAdminRole = ( req, res, next ) => {

    let usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROLE' ) {
        next();
    }else {
        return res.json({
            ok: false,
            err: {
                message: 'Usuario no autorizado para esta solicitud'
            }
        });
    }
    
};

module.exports = {
    verifica,
    verificaAdminRole,
}