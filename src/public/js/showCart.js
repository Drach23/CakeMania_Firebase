document.addEventListener('DOMContentLoaded', function() {
    var cartItemsDiv = document.getElementById('cart-items');
    
    // Recuperar el carrito del almacenamiento local
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    
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
});

function removeFromCart(index) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); // Recargar la página para reflejar los cambios
}

function adjustQuantity(index, change) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var item = cart[index];
    item.quantity = Math.max(parseInt(item.quantity) + change, 1); // Asegurarse de que la cantidad nunca sea menor que 1
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); // Recargar la página para reflejar los cambios
}
