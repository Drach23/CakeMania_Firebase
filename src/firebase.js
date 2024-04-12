require('dotenv').config()

const {getFirestore} = require('firebase-admin/firestore')//obtiene el modulo de Firestore mediante los paquetes instalados
const {initializeApp, applicationDefault} = require('firebase-admin/app')//obtiene el modulo firebase-admin desde los paquetes


initializeApp({//Obtiene las credenciales de administrador 
    credential: applicationDefault()
})

const db = getFirestore()//creamos la constante que tiene acceso a la base de datos

module.exports = {
    db,
}