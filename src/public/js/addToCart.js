// Importa la instancia de Firebase
// Importa la función doc desde la biblioteca firebase-firestore
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Resto del código de addToCart.js...

import { auth, db } from '/public/js/firebaseLogin.js';

// Resto del código de addToCart.js...

// Función para agregar elementos al carrito asociados con el usuario autenticado
async function addToCart(productName, price, quantity, description, imageUrl) {
  try {
      const userId = auth.currentUser.uid;
      const cartRef = doc(db, "carts", userId);
      const cartData = (await getDoc(cartRef)).data() || { items: [] };
      cartData.items.push({ productName, price, quantity, description, imageUrl });
      await setDoc(cartRef, cartData);
      alert("Producto agregado al carrito:", { productName, price, quantity, description });
  } catch (error) {
      alert("Error al agregar producto al carrito:", error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var cartItemsDiv = document.getElementById('cart-items');
  var userId = localStorage.getItem('userId');

  if (userId) {
      // Recuperar el carrito del almacenamiento local
      var cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

      // Mostrar cada elemento del carrito en la página
      cart.forEach(function(item, index) {
          var itemDiv = document.createElement('div');
          itemDiv.classList.add('cart-item');
          itemDiv.innerHTML = `
              <div class="product-info">
                  <p><strong>Producto:</strong> ${item.productName}</p>
                  <p><strong>Precio:</strong> ${item.price}</p>
                  <p><strong>Cantidad:</strong> ${item.quantity}</p>
                  <p><strong>Descripción:</strong> ${item.description}</p>
              </div>
              <div class="quantity-buttons">
                  <button class="remove-button" onclick="removeFromCart(${index})">Eliminar</button>
                  <button onclick="adjustQuantity(${index}, -1)">-</button>
                  <button onclick="adjustQuantity(${index}, 1)">+</button>
              </div>
          `;
          cartItemsDiv.appendChild(itemDiv);
      });
  } else {
      cartItemsDiv.innerHTML = '<p>No has iniciado sesión. Por favor, inicia sesión para ver tu carrito de compras.</p>';
  }
});



// Busca el botón "Agregar al Carrito" por su clase y agrega un event listener
document.querySelector(".add-to-cart").addEventListener("click", function() {
  // Obtén los detalles del producto
  var productName = document.querySelector(".product-title").innerText;
  var productPrice = document.querySelector(".product-price").innerText.split(":")[1].trim();
  var quantity = document.getElementById("input_cant").value;
  var productDescription = document.querySelector(".description p").innerText;
  var imageUrl = document.querySelector(".product-image img").getAttribute("data-image-url");
  // Llama a la función addToCart con los detalles del producto
  addToCart(productName, productPrice, quantity, productDescription, imageUrl);
});

