//==========PORT========
process.env.PORT = process.env.PORT || 3000;

//==========ENTORNO========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========BASE DE DATOS========
let urlDB;

if( process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
    
}else {

    urlDB = process.env.MONGO_URL;
    
}

process.env.URLDB = urlDB;

//==========TOKEN FECHA FIN========
process.env.FECHA_FIN_TOKEN = 60 * 60 * 24 * 30;

//==========TOKEN FECHA FIN========
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';