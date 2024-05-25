const { db } = require('../firebase');
const { v4: uuidv4 } = require('uuid');
const { uploadImageToStorage} = require('../public/js/imageUpload.js');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

// Función para obtener la URL completa de la imagen en Firebase Storage
async function getImageUrl(imageName) {
  const storage = new Storage();
  const bucket = storage.bucket('cakemania-908db.appspot.com'); // Nombre de tu bucket en Firebase Storage
  const file = bucket.file(imageName);
  const signedUrl = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // URL válida por una semana
  });

  return signedUrl[0];
}

// Configura el almacenamiento de multer para subir directamente a Firebase Storage
const storage = multer.memoryStorage(); // Almacenamiento en memoria para archivos
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    // Añade aquí tus propias validaciones de archivo si es necesario
    cb(null, true);
  }
}).single('productImage'); // El nombre del campo de formulario para el archivo


exports.showNewProductForm = async (req, res) => {
  res.render('newProduct');
};

exports.showProductsLanding = async (req, res) => {
    res.render('products-landing');
  };

exports.createNewProduct = async (req, res) => {
  const { productName, productDescription, productPrice, productCategory } = req.body;
  const file = req.file; // Obtiene el archivo de la solicitud

  try {
    // Genera un nombre único para la imagen utilizando UUID
    const imageFileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;

    // Sube la imagen a Firebase Storage
    const imageUrl = await uploadImageToStorage(file, imageFileName);

    const categoryToCollection = {
      "cupcake": "products-cupcake",
      "cakes": "products-cake",
      "milkshake": "products-milkshake",
      "pie": "products-pie",
      "bake": "products-bake",
      "jelly": "products-jelly"
    };

    const collectionName = categoryToCollection[productCategory];

    // Guarda el producto en la base de datos en la colección correspondiente
    await db.collection(collectionName).add({
      productName,
      productDescription,
      productPrice,
      productCategory,
      imageName: imageFileName // Guarda el nombre del archivo de la imagen en la base de datos
    });

    res.redirect(`/products`);
  } catch (error) {
    console.error("Ha habido un error al crear el producto: ", error);
    res.status(500).send("Error interno en el servidor");
  }
};

// Mostrar los productos de la categoría "Cupcake"
exports.showCupcakeProducts = async (req, res) => {
  try {
    const querySnapshot = await db.collection('products-cupcake').get();
    const products = querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = await getImageUrl(data.imageName); // Obtiene la URL de la imagen

      // Retorna un objeto con los datos del producto y la URL de la imagen
      return {
        id: doc.id,
        ...data,
        imageUrl: imageUrl // Agrega la URL de la imagen al objeto del producto
      };
    });

    // Espera a que se resuelvan todas las promesas de obtención de URL de imagen
    const resolvedProducts = await Promise.all(products);

    res.render('products-cupcake', { "products-cupcake": resolvedProducts });
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    res.status(500).send("Error interno en el servidor");
  }
};

// Mostrar los productos de la categoría "Cake"
exports.showCakeProducts = async (req, res) => {
  try {
    const querySnapshot = await db.collection('products-cake').get();
    const products = querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = await getImageUrl(data.imageName); // Obtiene la URL de la imagen

      // Retorna un objeto con los datos del producto y la URL de la imagen
      return {
        id: doc.id,
        ...data,
        imageUrl: imageUrl // Agrega la URL de la imagen al objeto del producto
      };
    });

    // Espera a que se resuelvan todas las promesas de obtención de URL de imagen
    const resolvedProducts = await Promise.all(products);

    res.render('products-cake', { "products-cake": resolvedProducts });
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    res.status(500).send("Error interno en el servidor");
  }
};

// Mostrar los productos de la categoría "Milkshake"
exports.showMilkshakeProducts = async (req, res) => {
  try {
    const querySnapshot = await db.collection('products-milkshake').get();
    const products = querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = await getImageUrl(data.imageName); // Obtiene la URL de la imagen

      // Retorna un objeto con los datos del producto y la URL de la imagen
      return {
        id: doc.id,
        ...data,
        imageUrl: imageUrl // Agrega la URL de la imagen al objeto del producto
      };
    });

    // Espera a que se resuelvan todas las promesas de obtención de URL de imagen
    const resolvedProducts = await Promise.all(products);

    res.render('products-milkshake', { "products-milkshake": resolvedProducts });
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    res.status(500).send("Error interno en el servidor");
  }
};

// Mostrar los productos de la categoría "Pie"
exports.showPieProducts = async (req, res) => {
  try {
    const querySnapshot = await db.collection('products-pie').get();
    const products = querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = await getImageUrl(data.imageName); // Obtiene la URL de la imagen

      // Retorna un objeto con los datos del producto y la URL de la imagen
      return {
        id: doc.id,
        ...data,
        imageUrl: imageUrl // Agrega la URL de la imagen al objeto del producto
      };
    });

    // Espera a que se resuelvan todas las promesas de obtención de URL de imagen
    const resolvedProducts = await Promise.all(products);

    res.render('products-pie', { "products-pie": resolvedProducts });
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    res.status(500).send("Error interno en el servidor");
  }
};

// Mostrar los productos de la categoría "Bake"
exports.showBakeProducts = async (req, res) => {
  try {
    const querySnapshot = await db.collection('products-bake').get();
    const products = querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = await getImageUrl(data.imageName); // Obtiene la URL de la imagen

      // Retorna un objeto con los datos del producto y la URL de la imagen
      return {
        id: doc.id,
        ...data,
        imageUrl: imageUrl // Agrega la URL de la imagen al objeto del producto
      };
    });

    // Espera a que se resuelvan todas las promesas de obtención de URL de imagen
    const resolvedProducts = await Promise.all(products);

    res.render('products-bake', { "products-bake": resolvedProducts });
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    res.status(500).send("Error interno en el servidor");
  }
};

// Mostrar los productos de la categoría "Jelly"
exports.showJellyProducts = async (req, res) => {
  try {
    const querySnapshot = await db.collection('products-jelly').get();
    const products = querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = await getImageUrl(data.imageName); // Obtiene la URL de la imagen

      // Retorna un objeto con los datos del producto y la URL de la imagen
      return {
        id: doc.id,
        ...data,
        imageUrl: imageUrl // Agrega la URL de la imagen al objeto del producto
      };
    });

    // Espera a que se resuelvan todas las promesas de obtención de URL de imagen
    const resolvedProducts = await Promise.all(products);

    res.render('products-jelly', { "products-jelly": resolvedProducts });
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    res.status(500).send("Error interno en el servidor");
  }
};

// Mostrar la página de aterrizaje de productos
exports.showProductsLanding = async (req, res) => {
  res.render('products-landing');
};

exports.getDetailedProduct = async (req, res) => {
  try {
    const categoryToCollection = {
      "cupcake": "products-cupcake",
      "cakes": "products-cake",
      "milkshake": "products-milkshake",
      "pie": "products-pie",
      "bake": "products-bake",
      "jelly": "products-jelly"
    };

    const productId = req.params.productId;
    const collectionName = categoryToCollection[req.params.category];
    const productSnapshot = await db.collection(collectionName).doc(productId).get();
    const productData = productSnapshot.data();

    // Obtiene la URL de la imagen asociada al producto
    const imageUrl = await getImageUrl(productData.imageName);

    // Combina los datos del producto con la URL de la imagen
    const productWithImage = {
      ...productData,
      imageUrl: imageUrl
    };

    res.render('detailedProduct', { products: [productWithImage] });
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
    res.status(500).send("Error interno en el servidor");
  }
};
  
