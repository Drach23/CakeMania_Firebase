import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNip1hN7oluDfRsVcyZ04-RWMmyQQkdvM",
  authDomain: "cakemania-908db.firebaseapp.com",
  projectId: "cakemania-908db",
  storageBucket: "cakemania-908db",
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

async function userLogin() {
  const email = inputEmail.value;
  const password = inputPassword.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      localStorage.setItem("userData", JSON.stringify(userData));

      alert("Inicio de sesión exitoso");
      window.location.href = "/"; // Redirecciona al inicio

    } else {
      console.error("No se encontraron datos de usuario en la base de datos");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error al iniciar sesión: " + error.message);
  }
}

const buttonLogin = document.querySelector(".login__button");
if (buttonLogin) {
  buttonLogin.addEventListener("click", (event) => {
    event.preventDefault(); // Evita la recarga de la página
    userLogin(); // Llama a la función de inicio de sesión
  });
}

function getUserDataFromLocalStorage() {
  const userDataString = localStorage.getItem("userData");
  return userDataString ? JSON.parse(userDataString) : null;
}

function updateUserInfo() {
  const userInfoDiv = document.getElementById("user-info");
  const userData = getUserDataFromLocalStorage();

  if (userData) {
    userInfoDiv.innerHTML = 
    `<div class="dropdown">
    <p class="login_welcomeMessage">Bienvenido, ${userData.username}</p>
    <div class="dropdown-content">
      <a href="/profile">Configuración de perfil</a>
      <a href="#" id="logoutButton">Cerrar sesión</a>
    </div>
  </div>`;
  } else {
    userInfoDiv.innerHTML = `<a class="btn" href="/login" class="btn"><button>Iniciar sesión</button></a>`;
  }
}
// Función para cerrar sesión
function userLogout() {
  const auth = getAuth();
  signOut(auth).then(() => {
    // Borrar los datos del usuario del localStorage
    localStorage.removeItem("userData");

    // Redireccionar al usuario a la página de inicio de sesión o a otra página
    window.location.href = "/login";
  }).catch((error) => {
    console.error("Error al cerrar sesión:", error);
    alert("Error al cerrar sesión: " + error.message);
  });
}

// Adjuntar evento de clic al botón de logout después de que se cargue el DOM
const userInfoDiv = document.getElementById("user-info");
userInfoDiv.addEventListener("click", (event) => {
  const logoutButton = event.target.closest("#logoutButton");
  if (logoutButton) {
    event.preventDefault();
    userLogout();
  }
});



document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  updateUserInfo();
});
