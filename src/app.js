const express = require('express');
const { ExpressHandlebars } = require('express-handlebars');
const morgan = require('morgan')
const path = require('path')
const exphbs = require("express-handlebars");
const multer = require("multer")



const app = express();

// Configura el middleware de Multer
const storage = multer.memoryStorage(); // Almacenamiento en memoria para archivos
const upload = multer({ storage: storage });


app.set('views', path.join(__dirname, 'views'))

app.engine('.hbs', exphbs.create({ //Creamos un engine con el cual podremos definir rutas predeterminadas para carga de datos
    defaultLayout: 'main',
    extname: '.hbs'
}).engine);

app.set('view engine', 'hbs') //Aqui utilizamos el engine

app.use(morgan('dev')) //corre el archivo con npm run dev gracias al script creado en package.json llamado "dev"

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(upload.single('productImage')); // Usa Multer antes de tus rutas
//importar la ruta de usuarios

app.use(require('./routes/index'));
app.use(require('./routes/userRoutes'));
app.use(require('./routes/productRoutes'));

//rutas publicas del css y obtencion de recursos esteticos.
app.use('/public/css',express.static(path.join(__dirname, '/public/css')))
app.use('/public/img',express.static(path.join(__dirname, '/public/img')))
app.use('/public/js',express.static(path.join(__dirname,'/public/js')))
module.exports = app;
