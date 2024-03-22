require('dotenv').config()

const {getFirestore} = require('firebase-admin/firestore')
const {initializeApp, applicationDefault} = require('firebase-admin/app')

initializeApp({
    credential: applicationDefault()
})

const db = getFirestore()

module.exports ={
    db,
}