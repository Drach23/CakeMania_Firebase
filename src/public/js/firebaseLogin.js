import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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
    const email = inputEmail.value;
    const password = inputPassword.value;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Si el inicio de sesión es exitoso
      const user = userCredential.user;
      
      // Obtener los datos del usuario desde Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          // Guardar los datos del usuario en la base de datos local o en el estado de la aplicación
          // Por ejemplo, podrías guardarlos en el localStorage
          localStorage.setItem("userData", JSON.stringify(userData));
          
          alert("Inicio de sesión exitoso");

          // Obtener los datos del usuario almacenados en el localStorage
const userDataString = localStorage.getItem("userData");

// Verificar si hay datos de usuario en el localStorage
if (userDataString) {
  // Si hay datos, convertir la cadena JSON a un objeto JavaScript
  const userData = JSON.parse(userDataString);
  
  // Ahora puedes acceder a los datos del usuario individualmente
  const email = userData.email;
  const firstName = userData.firstname;
  const lastName = userData.lastname;
  const phone = userData.phone;
  const username = userData.username;
  
  // Hacer lo que necesites con los datos del usuario
  console.log(email, firstName, lastName, phone, username);
} else {
  console.log("No se encontraron datos de usuario en el localStorage");
}

      } else {
          console.error("No se encontraron datos de usuario en la base de datos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión:", error.message);
    }
}

const buttonLogin = document.querySelector(".login__button");
buttonLogin.addEventListener("click", (event) => {
  event.preventDefault(); // Evita la recarga de la página
  userLogin(); // Llama a la función de inicio de sesión
});
