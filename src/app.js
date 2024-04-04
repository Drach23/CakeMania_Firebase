const express = require('express');
const { ExpressHandlebars } = require('express-handlebars');
const morgan = require('morgan')
const path = require('path')
const exphbs = require("express-handlebars");


const app = express();

app.set('views', path.join(__dirname, 'views'))

app.engine('.hbs', exphbs.create({ //Creamos un engine con el cual podremos definir rutas predeterminadas para carga de datos
    defaultLayout: 'main',
    extname: '.hbs'
}).engine);

app.set('view engine', 'hbs') //Aqui utilizamos el engine

app.use(morgan('dev')) //corre el archivo con npm run dev gracias al script creado en package.json llamado "dev"

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(require('./routes/index'))

//rutas publicas del css y obtencion de recursos esteticos.
app.use('/public/css',express.static(path.join(__dirname, 'public/css')))
app.use('/public/img',express.static(path.join(__dirname, '/public/img')))
app.use('/public/js',express.static(path.join(__dirname,'/public/js')))
module.exports = app;
