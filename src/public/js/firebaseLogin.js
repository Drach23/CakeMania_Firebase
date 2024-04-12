// Importa los métodos necesarios para la autenticación
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"; // Asegúrate de importar correctamente firebase-auth.js



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

const inputEmail = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");

async function userLogin(){
    const email = inputEmail.value
    const password = inputPassword.value
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Si el inicio de sesión es exitoso, puedes redirigir a otra página o mostrar un mensaje de éxito
      alert("Inicio de sesión exitoso");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión:", error.message);
      // Maneja el error, por ejemplo, mostrando un mensaje de error al usuario
    }
  }

  
  const buttonLogin = document.querySelector(".buttons");
buttonLogin.addEventListener("click", (event) => {
  event.preventDefault(); // Evita la recarga de la página
  userLogin(); // Llama a la función de inicio de sesión
});

  