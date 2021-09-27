require('./config/config');

const express = require('express');
const app = express();

app.use( express.urlencoded({ extended: false }) )
//app.use(express.json)

app.get('/usuario', (req, res) => {
    res.json('get usuario');
})

app.post('/usuario', (req, res) => {

    let body = req.body;
    
    if( body.nombre === undefined ) {
        res.status(400).json({
            ok: false,
            message: 'El nombre es requerido'
        })
    }else {
        res.json({ 
            persona: body
        })
    }
})

app.put('/usuario', (req, res) => {
    res.json('put usuario');
})

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
}) 