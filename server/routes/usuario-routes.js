const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario-model');
const { verifica, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();

app.use( express.urlencoded({ extended: false }) )

app.get('/usuario', verifica, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    
    Usuario.find({estado: true}, 'nombre email role status google')
    .skip(desde)
    .limit(limite)
    .exec( (err, usuarioDB) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        Usuario.count({ estado: true }, (err, conteo) => {
            res.json({
                ok: true,
                personas: usuarioDB,
                total: conteo
            });
        });
        
    });
    
})

app.post('/usuario', [verifica, verificaAdminRole], (req, res) => {

    let body = req.body;
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }

        //usuarioDB.password = null;
        
        res.json({ 
            ok: true,
            usuario: usuarioDB
        })
        
    });
    
})

app.put('/usuario/:id', verifica, (req, res) => {

    let id = req.params.id;
    let body = _.pick( req.body, ['nombre', 'email', 'img', 'estado', 'role'] );
    
    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB ) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `Error en el id: ${ id }`,
                    err
                }
            })
        }

        res.json({ 
            ok: true,
            usuario: usuarioDB
        })
        
    });
    
})

app.delete('/usuario/:id', verifica, (req, res) => {

    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    }
    
    Usuario.findByIdAndUpdate( id, cambiarEstado, {new: true}, (err, usuarioDB ) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }

        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        
        res.json({ 
            ok: true,
            usuario: usuarioDB
        })
        
    });
    
})

module.exports = app;