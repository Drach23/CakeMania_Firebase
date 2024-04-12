const crypto = require('crypto');

// Longitud en bytes de la clave secreta
const length = 32;

// Generar una clave secreta aleatoria
const secret = crypto.randomBytes(length).toString('hex');

console.log(secret);