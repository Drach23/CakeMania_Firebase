require('dotenv').config()

const {getFirestore} = require('firebase-admin/firestore')//obtiene el modulo de Firestore mediante los paquetes instalados
const {initializeApp, applicationDefault} = require('firebase-admin/app')//obtiene el modulo firebase-admin desde los paquetes
const { getAuth } = require('firebase-admin/auth'); // Importar el módulo de autenticación


initializeApp({//Obtiene las credenciales de administrador 
    credential: applicationDefault()
})

const db = getFirestore()//creamos la constante que tiene acceso a la base de datos
const auth = getAuth;

module.exports = {
    db,
    auth,
}