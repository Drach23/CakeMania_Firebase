import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import { auth, db } from '/public/js/firebaseLogin.js';

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

document.addEventListener('DOMContentLoaded', function() {
  const cartItemsDiv = document.getElementById('cart-items');
  const userId = localStorage.getItem('userId');

  // Verificar si el usuario está autenticado
  if (userId) {
    loadCart(userId);
  } else {
    cartItemsDiv.innerHTML = '<p>No has iniciado sesión. Por favor, inicia sesión para ver tu carrito de compras.</p>';
  }
});

async function loadCart(userId) {
  const cartItemsDiv = document.getElementById('cart-items');
  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      displayCartItems(cartData.items);
    } else {
      cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
    }
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    cartItemsDiv.innerHTML = '<p>Error al cargar el carrito.</p>';
  }
}
function displayCartItems(items) {
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';
  let totalCart = 0; // Inicializa el total del carrito en 0
  items.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    const itemTotal = parseFloat(item.price) * parseInt(item.quantity); // Calcula el total del producto
    totalCart += itemTotal; // Suma el total del producto al total del carrito
    itemDiv.innerHTML = `
      <div class="product-info">
        <p><strong>Producto:</strong> ${item.productName}</p>
        <p><strong>Descripción:</strong> ${item.description}</p>
        <p><strong>Precio: $</strong> ${item.price} Mx</p>
        <p><strong>Cantidad:</strong> ${item.quantity}</p>
        <p><strong>sub total: $</strong> ${itemTotal.toFixed(2)} Mx</p> <!-- Muestra el total del producto -->
        
      </div>
      <div class="quantity-buttons">
        <button class="remove-button" data-index="${index}">Eliminar</button>
        <button class="decrease-quantity" data-index="${index}">-</button>
        <button class="increase-quantity" data-index="${index}">+</button>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });

  // Muestra el total del carrito
  const totalDiv = document.createElement('div');
  totalDiv.innerHTML = `<p><strong>Total del Carrito: $</strong> ${totalCart.toFixed(2)} Mx</p>`;
  cartItemsDiv.appendChild(totalDiv);



  // Add event listeners for the dynamically added buttons
  document.querySelectorAll('.remove-button').forEach(button => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      removeFromCart(index);
    });
  });

  document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      adjustQuantity(index, -1);
    });
  });

  document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      adjustQuantity(index, 1);
    });
  });
}

async function removeFromCart(index) {
  const userId = localStorage.getItem('userId');
  if (userId) {
    try {
      const cartRef = doc(db, "carts", userId);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        cartData.items.splice(index, 1);
        await setDoc(cartRef, cartData);
        loadCart(userId); // Recargar el carrito para reflejar los cambios
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
    }
  }
}

async function adjustQuantity(index, change) {
  const userId = localStorage.getItem('userId');
  if (userId) {
    try {
      const cartRef = doc(db, "carts", userId);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const item = cartData.items[index];
        item.quantity = Math.max(parseInt(item.quantity) + change, 1); // Asegurarse de que la cantidad nunca sea menor que 1
        await setDoc(cartRef, cartData);
        loadCart(userId); // Recargar el carrito para reflejar los cambios
      }
    } catch (error) {
      console.error("Error al ajustar la cantidad del producto:", error);
    }
  }
}
