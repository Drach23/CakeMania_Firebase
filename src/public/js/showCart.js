import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc,deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
        <img src="${item.imageUrl}" alt="${item.productName}">
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

document.addEventListener('DOMContentLoaded', function() {
  const purchaseButton = document.querySelector('.purchase-button');
  purchaseButton.addEventListener('click', generatePDF);
});

async function generatePDF() {
  const pdfDoc = new window.jspdf.jsPDF();

  // Add the store name
  pdfDoc.setFontSize(16);
  pdfDoc.text('CakeMania', 105, 20, { align: 'center' });

  // Add the title "Purchase Details"
  pdfDoc.setFontSize(14);
  pdfDoc.text('Purchase Details', 105, 30, { align: 'center' });

  const userId = localStorage.getItem('userId');
  if (userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        pdfDoc.setFontSize(12);
        pdfDoc.text("DATOS DEL CLIENTE:", 10, 40);
        pdfDoc.text(`Nombre: ${userData.firstname} ${userData.lastname}`, 10, 50);
        pdfDoc.text(`Email: ${userData.email}`, 10, 60);
        pdfDoc.text(`Phone: ${userData.phone}`, 10, 70);
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }

  if (userId) {
    try {
      const cartRef = doc(db, "carts", userId);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        let y = 90;
        const columnWidths = [40, 65, 30, 30, 30]; // Define maximum widths for each column
        pdfDoc.setFontSize(12);
        pdfDoc.setLineWidth(0.1);
        pdfDoc.line(10, y, 200, y);
        y += 10;
        pdfDoc.text('Producto', 20, y); // Adjusted the position of the table header
        pdfDoc.text('Descripcion', 60, y); // Adjusted the position of the table header
        pdfDoc.text('Precio', 120, y); // Adjusted the position of the table header
        pdfDoc.text('Cantidad', 160, y); // Adjusted the position of the table header
        pdfDoc.text('Subtotal', 185, y); // Adjusted the position of the table header
        y += 5;
        pdfDoc.line(10, y, 200, y);
        y += 5;

        let totalCart = 0; // Initialize total cart value
        cartData.items.forEach(product => {
          // Adjust text to fit within column widths
          const productName = pdfDoc.splitTextToSize(product.productName, columnWidths[0]);
          const description = pdfDoc.splitTextToSize(product.description, columnWidths[1]);
          const price = pdfDoc.splitTextToSize(`$${product.price} Mx`, columnWidths[2]);
          const quantity = pdfDoc.splitTextToSize(product.quantity, columnWidths[3]);
          const subtotal = parseFloat(product.price) * parseInt(product.quantity);
          totalCart += subtotal; // Calculate total cart value
          const totalString = `$${subtotal.toFixed(2)} Mx`;
          const totalWidth = pdfDoc.getStringUnitWidth(totalString) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
          pdfDoc.text(productName, 15, y);
          pdfDoc.text(description, 55, y);
          pdfDoc.text(price, 125, y);
          pdfDoc.text(quantity, 165, y);
          pdfDoc.text(totalString, 185 + (30 - totalWidth), y); // Adjusted the position of the Total column
          y += 10;
        });

        // Display total cart value at the bottom
        const totalString = `$${totalCart.toFixed(2)} Mx`;
        pdfDoc.text(`Total de la compra: ${totalString}`, 105, y + 10, { align: 'center' });

        // Save the PDF
        pdfDoc.save('purchase_details.pdf');
        // Delete the entire cart from the database
        await deleteDoc(cartRef);
        // Alert and redirect
        alert("Pedido completado");
        window.location.href = "/";

      } else {
        console.error("Tu carrito está vacío.");
      }
    } catch (error) {
      console.error("Error getting cart details:", error);
    }
  }
}
