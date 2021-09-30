const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const Usuario = require('../models/usuario-model');
const Producto = require('../models/producto-model');

// default options
app.use( fileUpload() );

app.put('/upload/:tipo/:id', (req, res) => {

  let tipo = req.params.tipo;
  let id = req.params.id;

  let tipoPermitido = ['productos', 'usuarios'];

  if( tipoPermitido.indexOf( tipo ) < 0 ) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `No existe el tipo ${tipo}
        Solo ${tipoPermitido.join(', ')}`
      }
    });
  }
  
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha seleccionado ningún archivo'
      }
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  let extensionArchivo = archivo.name.split('.')[1];
  let extensionesPermitidas = ['jpg', 'png', 'jpeg'];

  if( !extensionArchivo ) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `El archivo no cuenta con una extensión`
      }
    });
  }

  if(extensionesPermitidas.indexOf( extensionArchivo ) < 0 ) {
    
    return res.status(400).json({
      ok: false,
      err: {
        message: `Extension ${extensionArchivo} no valida
        Permitidos: ${extensionesPermitidas.join(', ')}`
      }
    });
    
  }

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
  let ruta = `server/uploads/${tipo}/${nombreArchivo}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv( ruta, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err: {
          message: `ERRORRRRRRRRRRRRRRRRR `,
          err
        }
      });

      if( tipo === 'usuarios') {
        imagenUsuario(id, res, nombreArchivo);
      }
      else if( tipo === 'productos') {
        imagenProducto(id, res, nombreArchivo);
      }
      
  });

});

function imagenUsuario( id, res, nombreArchivo ) {

  Usuario.findById( id, (err, usuarioDB) => {

    if( err ) {

      borrarArchivo(nombreArchivo, 'usuarios');
      
      return res.status(500).json({
        ok: false,
        err: {
          message: 'ERROR 90',
          err
        }
      });
    }

    if( !usuarioDB ) {

      borrarArchivo(nombreArchivo, 'usuarios');
      
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El usuario no existe',
          err: {
            message: 'ERROR 99',
            err
          }
        }
      });
    }

    borrarArchivo(usuarioDB.img, 'usuarios');
    
    usuarioDB.img = nombreArchivo;

    usuarioDB.save( ( err, usuarioGuardado ) => {

      if( err ) {
        return res.status(500).json({
          ok: false,
          err: {
            message: 'ERROR 111',
            err
          }
        });
      }

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        imagen: nombreArchivo
      });
      
    });
    
  })
  
}

function imagenProducto( id, res, nombreArchivo ) {

  Producto.findById( id, (err, prodDB) => {

    if( err ) {

      borrarArchivo(nombreArchivo, 'productos');
      
      return res.status(500).json({
        ok: false,
        err: {
          message: 'ERROR 162',
          err
        }
      });
    }

    if( !prodDB ) {

      borrarArchivo(nombreArchivo, 'productos');
      
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe',
          err: {
            message: 'ERROR 177',
            err
          }
        }
      });
    }

    borrarArchivo(prodDB.img, 'productos');
    
    prodDB.img = nombreArchivo;

    prodDB.save( ( err, prodGuardado ) => {

      if( err ) {
        return res.status(500).json({
          ok: false,
          err: {
            message: 'ERROR 194',
            err
          }
        });
      }

      res.json({
        ok: true,
        producto: prodGuardado,
        imagen: nombreArchivo
      });
      
    });
    
  })
  
}

function borrarArchivo(nombreImagen, tipo) {

  let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${nombreImagen}`);

  if( fs.existsSync(pathImagen) ) {
    fs.unlinkSync(pathImagen);
  }
  
}

module.exports = app;
