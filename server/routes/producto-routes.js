const express = require('express');
const _ = require('underscore');
const uniqueValidator = require('mongoose-unique-validator');

const { verifica, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();
const Producto = require('../models/producto-model');

app.get('/producto', verifica, (req, res) => {

    Producto.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec( (err, prodDB) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    producto: prodDB,
                    total: conteo
                });
            });
            
        });
    
});

app.get('/producto/:id', verifica, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, ( err, prodDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !prodDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: prodDB
        });
        
    });
    
});

app.post('/producto', verifica, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( ( err, prodDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Producto ingresado correctamente',
            producto: prodDB
        });
        
    });
    
});

app.get('/producto/buscar/:termino', verifica, ( req, res ) => {

    let termino = req.params.termino;
    let regex = RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec( ( err, prodDB ) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
           
            res.json({
                ok: true,
                producto: prodDB
            });
            
        });
    
});

app.put('/producto/:id', verifica, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, ( err, prodDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !prodDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        prodDB.nombre = body.nombre;
        prodDB.descripcion = body.descripcion,
        prodDB.disponible = body.disponible || prodDB.disponible;
        prodDB.precioUni = body.precioUni;
        prodDB.categoria = body.categoria || prodDB.categoria;

        prodDB.save( ( err, prodUpdate ) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            
            res.json({
                ok: true,
                message: 'Producto actualizado',
                producto: prodUpdate
            });

        });
        
        
    });
    
});

app.delete('/producto/:id', [verifica, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let cambiarEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiarEstado, ( err, prodDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !prodDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto eliminado'
        });
        
    });
    
});

module.exports = app;