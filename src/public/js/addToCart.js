// Función para agregar el producto al carrito con la cantidad seleccionada
document.querySelector(".add-to-cart").addEventListener("click", function() {
    var productName = document.querySelector(".product-title").innerText;
    var productPrice = document.querySelector(".product-price").innerText.split(":")[1].trim();
    var quantity = document.getElementById("input_cant").value;
    var productDescription = document.querySelector(".description p").innerText;
    addToCart(productName, productPrice, quantity, productDescription);
  });
  
  // Función para agregar elementos al carrito
  function addToCart(productName, price, quantity, description) {
    // Obtener el carrito del almacenamiento local (si existe)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Agregar el nuevo producto al carrito con la cantidad seleccionada
    cart.push({ productName, price, quantity, description });
  
    // Guardar el carrito actualizado en el almacenamiento local
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Actualizar la UI o realizar otras acciones según sea necesario
    console.log("Producto agregado al carrito:", { productName, price, quantity, description });
  }
  