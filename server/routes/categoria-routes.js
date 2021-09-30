const express = require('express');
const _ = require('underscore');
const uniqueValidator = require('mongoose-unique-validator');

const { verifica, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();
const Categoria = require('../models/categoria-model');

app.get('/categoria', verifica, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, catDB) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({ }, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria: catDB,
                    total: conteo
                });
            });
            
        });
    
});

app.get('/categoria/:id', verifica, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, ( err, catDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !catDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: catDB
        });
        
    });
    
});

app.post('/categoria', verifica, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( ( err, catDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Categoria ingresada correctamente',
            categoria: catDB
        });
        
    });
    
});

app.put('/categoria/:id', verifica, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, {new: true, uniqueValidator: true}, ( err, catDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !catDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria actualizada',
            categoria: catDB
        });
        
    });
    
});

app.delete('/categoria/:id', [verifica, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    }

    Categoria.findByIdAndUpdate(id, cambiarEstado, ( err, catDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !catDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria eliminada'
        });
        
    });
    
});

module.exports = app;