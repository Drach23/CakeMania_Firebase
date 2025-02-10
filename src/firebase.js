require('dotenv').config()

const {getFirestore} = require('firebase-admin/firestore')//obtiene el modulo de Firestore mediante los paquetes instalados
const {initializeApp, applicationDefault} = require('firebase-admin/app')//obtiene el modulo firebase-admin desde los paquetes


const adminConfig = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? { credential: applicationDefault(), storageBucket: 'gs://cakemania-908db.appspot.com' }
  : { credential: cert(require('./config/serviceAccountKey.json')), storageBucket: 'gs://cakemania-908db.appspot.com' };

initializeApp(adminConfig);
const db = getFirestore()//creamos la constante que tiene acceso a la base de datos

module.exports = {
    db
}