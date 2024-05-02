const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

//Ruta para el index
router.get('/products', productController.showProductsLanding);

// Ruta para mostrar el formulario de creación de un nuevo producto
router.get('/new-product', productController.showNewProductForm);

// Ruta para crear un nuevo producto
router.post('/new-product', productController.createNewProduct);

router.get('/products-cake', productController.showCakeProducts);

router.get('/products-cupcake', productController.showCupcakeProducts);

router.get('/products-milkshake', productController.showMilkshakeProducts);

router.get('/products-pie',productController.showPieProducts);

router.get('/products-bake',productController.showBakeProducts);

router.get('/products-jelly',productController.showJellyProducts);

router.get("/detailedProduct/:category/:productId", productController.getDetailedProduct);


module.exports = router;
