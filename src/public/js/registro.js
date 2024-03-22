// Importa los métodos necesarios para la autenticación
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"; // Asegúrate de importar correctamente firebase-auth.js
import { scrypt } from 'scrypt-js';



const firebaseConfig = {
  apiKey: "AIzaSyDNip1hN7oluDfRsVcyZ04-RWMmyQQkdvM",
  authDomain: "cakemania-908db.firebaseapp.com",
  projectId: "cakemania-908db",
  storageBucket: "cakemania-908db.appspot.com",
  messagingSenderId: "688269458179",
  appId: "1:688269458179:web:6d59d5ef3ad2ce087d4736",
  measurementId: "G-38F4RMDQF4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(); // Obtiene el objeto de autenticación

// Referencias a los campos de entrada
const inputName = document.getElementById("inputName");
const inputLastName = document.getElementById("inputLastName");
const inputPhone = document.getElementById("inputPhone");
const inputEmail = document.getElementById("inputEmail");
const inputUsername = document.getElementById("inputUsername");
const inputPassword = document.getElementById("inputPassword");
const inputConfirmPassword = document.getElementById("inputConfirmPassword")

// Función para enviar los datos a Firestore y crear el usuario
async function enviarDatos() {
  // Obtiene los valores de los campos
  const firstName = inputName.value.trim();
  const lastName = inputLastName.value.trim();
  const phone = inputPhone.value.trim();
  const email = inputEmail.value.trim();
  const username = inputUsername.value.trim();
  const password = inputPassword.value.trim();

  try {
    // Genera el hash de la contraseña
    const { hash, salt } = await generatePasswordHash(password);

    // Crea el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, hash); // Aquí envía el hash en lugar de la contraseña

    // Obtiene el usuario creado
    const user = userCredential.user;

    // Crea un objeto con los datos del usuario, incluyendo el hash y el salt
    const userData = {
      firstName,
      lastName,
      phone,
      email,
      username,
      hash, // Guarda el hash en Firestore
      salt, // Guarda el salt en Firestore
    };

    const userId = auth.currentUser.uid;

    // Guarda los datos del usuario en Firestore
    await setDoc(doc(db, "users", userId), userData);
    alert("Usuario Registrado exitosamente")
    console.log("Usuario registrado exitosamente.");
    clearForm();
    // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito o redirigir a otra página
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
  }
}

// Escucha el evento de clic del botón "CREAR CUENTA"
const buttonCrearCuenta = document.querySelector(".buttons");
buttonCrearCuenta.addEventListener("click", () => {
  if(!validateForm()){
    console.log("mataste algo")
  }else{
  enviarDatos(); // Llama a la función para enviar los datos a Firestore y crear el usuario
  }
});

function clearForm(){
  inputName.value = "";
  inputLastName.value = "";
  inputPhone.value = "";
  inputEmail.value = "";
  inputUsername.value = "";
  inputPassword.value = "";
  inputConfirmPassword.value = "";
}

function validateForm() {
  // Obtiene los valores de los campos de entrada dentro de la función
  const firstName = inputName.value.trim();
  const lastName = inputLastName.value.trim();
  const phone = inputPhone.value.trim();
  const email = inputEmail.value.trim();
  const username = inputUsername.value.trim();
  const password = inputPassword.value.trim();
  const confirmPassword = inputConfirmPassword.value.trim();

  if (firstName === '' || lastName === '' || phone === '' || email === '' || username === '' || password === '' || confirmPassword === '') {
    alert("Por favor, complete todos los campos.");
    return false;
  }

  // Validación de formato de correo electrónico
  /** 
   * TODO REALIZAR EL METODO DE VALIDACION DEL CORREO ELECTRONICO
  */

  if (password.length < 8) {
    alert("La contraseña debe tener al menos 8 caracteres.");
    return false;
  }
   // Validación de coincidencia de contraseña
   if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return false;
  }
  // Validación de SQL Injection
  const sqlRegex = /([';]|\-\-)/;
  if (sqlRegex.test(firstName) || sqlRegex.test(lastName) || sqlRegex.test(phone) || sqlRegex.test(email) || sqlRegex.test(username)) {
    alert("Los campos no deben contener caracteres especiales.");
    return false;
  }

  return true;
}

// Función para generar el hash de la contraseña
// Función para generar el hash de la contraseña
async function generatePasswordHash(password) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltSeparator = Uint8Array.from(atob('Bw=='), c => c.charCodeAt(0));
  const salt = new Uint8Array(16); // Tamaño del salt
  const rounds = 8;
  const memCost = 14;

  // Generar el salt
  for (let i = 0; i < salt.length; i++) {
    salt[i] = Math.floor(Math.random() * 256); // Generar valores aleatorios para el salt
  }

  // Utilizar scrypt para generar el hash
  const result = await scrypt(passwordBuffer, salt, 1 << rounds, memCost, 1, 64);

  // Convertir el resultado a base64
  const hash = btoa(String.fromCharCode.apply(null, new Uint8Array(result)));

  return { hash, salt };
}

