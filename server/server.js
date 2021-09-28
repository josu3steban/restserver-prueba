require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express(); 

app.use( express.urlencoded({ extended: false }) );
app.use( require('./routes/usuario-routes') );



mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, res) => {

    if( err ) {
        throw err;
    }else {
        console.log('Base de datos ONLINE');
    }

});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
}) 