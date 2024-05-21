// Importa los métodos necesarios para la autenticación
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"; // Asegúrate de importar correctamente firebase-auth.js

import { auth, db } from '/public/js/firebaseLogin.js';

import { userLogin } from '/public/js/firebaseLogin.js';



// Referencias a los campos de entrada
const inputName = document.getElementById("inputName");
const inputLastname = document.getElementById("inputLastname");
const inputPhone = document.getElementById("inputPhone");
const inputEmail = document.getElementById("inputEmail");
const inputUsername = document.getElementById("inputUsername");
const inputPassword = document.getElementById("inputPassword");
const inputConfirmPassword = document.getElementById("inputConfirmPassword")

// Función para enviar los datos a Firestore y crear el usuario
async function enviarDatos() {
  // Obtiene los valores de los campos
  const firstname = inputName.value.trim();
  const lastname = inputLastname.value.trim();
  const phone = inputPhone.value.trim();
  const email = inputEmail.value.trim();
  const username = inputUsername.value.trim();
  const password = inputPassword.value.trim();

  
    // Crea el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Aquí envía el hash en lugar de la contraseña

    // Obtiene el usuario creado
    const user = userCredential.user;

    // Crea un objeto con los datos del usuario
    const userData = {
      firstname,
      lastname,
      phone,
      email,
      username,
    };

    const userId = auth.currentUser.uid;
try{
    // Guarda los datos del usuario en Firestore
    await setDoc(doc(db, "users", userId), userData);
    alert("Usuario Registrado exitosamente")
    // Inicia sesión automáticamente después de crear la cuenta
    await userLogin();

    clearForm();
    // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito o redirigir a otra página
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
  }
}

function validateForm() {
  const firstname = inputName.value.trim();
  const lastname = inputLastname.value.trim();
  const phone = inputPhone.value.trim();
  const email = inputEmail.value.trim();
  const username = inputUsername.value.trim();
  const password = inputPassword.value.trim();
  const confirmPassword = inputConfirmPassword.value.trim();
  
  let errorMessage = "";

  if (!firstname) {
    errorMessage += "El nombre es obligatorio. ";
  }
  if (!lastname) {
    errorMessage += "Los apellidos son obligatorios. ";
  }
  if (!phone) {
    errorMessage += "El número de teléfono es obligatorio. ";
  }
  if (!email) {
    errorMessage += "El correo electrónico es obligatorio. ";
  }
  if (!username) {
    errorMessage += "El nombre de usuario es obligatorio. ";
  }
  if (!password) {
    errorMessage += "La contraseña es obligatoria. ";
  }
  if (password !== confirmPassword) {
    errorMessage += "Las contraseñas no coinciden. ";
  }

  if (errorMessage) {
    document.getElementById("errorMessage").textContent = errorMessage;
    return false;
  } else {
    document.getElementById("errorMessage").textContent = "";
    return true;
  }
}

 //Escucha el evento de clic del botón "CREAR CUENTA"
const buttonCrearCuenta = document.querySelector(".buttons");
buttonCrearCuenta.addEventListener("click", () => {
  enviarDatos(); // Llama a la función para enviar los datos a Firestore y crear el usuario
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


