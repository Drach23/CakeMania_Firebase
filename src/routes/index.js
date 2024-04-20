const { Router } = require('express')
const { db } = require('../firebase')
const multer = require('multer');
const { uploadImageToStorage } = require('../public/js/imageUpload.js');
const { Storage } = require('@google-cloud/storage');




const router = Router()

// Configura el almacenamiento de multer para subir directamente a Firebase Storage
const storage = multer.memoryStorage(); // Almacenamiento en memoria para archivos

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    // Añade aquí tus propias validaciones de archivo si es necesario
    cb(null, true);
  }
});

//Landing page
router.get('/', async (req, res) => {
  res.render('index')
})

//Login page
router.get('/login', async (req, res) => {
  res.render('login')
})




//mostrar usuarios
router.get('/show-users', async (req, res) => {
  const querySnapshot = await db.collection('users').get()
  const users = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  res.render('showUsers', { users })
})

/*
En esta seccion se encuentran los endpoint para usuarios.
*/
//Peticion get
router.get('/register', async (req, res) => {//Aqui se obtienen los datos de usuarios desde firebase.

  res.render('register')
})


//peticiones post
router.post('/new-user', async (req, res) => {
  const { firstname, lastname, phone, email, username, password } = req.body

  try {
    await db.collection('users').add({
      firstname,
      lastname,
      phone,
      email,
      username,
      password,
    });


    res.redirect('/')

  } catch (error) {
    console.error("Ha habido un error al crear al usuario", error);
    res.status(500).send("error interno en el servidor");
  };

})

//findUserById
router.get('/edit-user/:id', async (req, res) => {
  const doc = await db.collection('users').doc(req.params.id).get()

  res.render('editDialog', { user: { id: doc.id, ...doc.data() } })

})

//peticiones delete con confirmacion
router.get('/confirmDelete-user/:id', async (req, res) => {
  const doc = await db.collection('users').doc(req.params.id).get()
  res.render('deleteDialog', { user: { id: doc.id, ...doc.data() } })
})

//delete despues de confirmar
router.post('/delete-user/:id', async (req, res) => {
  const id = req.params.id.trim();

  try {
    await db.collection('users').doc(id).delete();
    res.redirect('/show-users');
  } catch (error) {
    console.error("Error al eliminar el usuario", error);
    res.status(500).send("Error interno del servidor.");
  }
});

//peticiones put (editar con id)
router.post('/update-user/:id', async (req, res) => {
  const { firstname, lastname, email, phone, username } = req.body;
  const id = req.params.id.trim() //elimina espacios en blanco;
  try {
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send("Usuario no encontrado");
    }
    //Actualizar el documento con los nuevos datos.
    await userRef.update({
      firstname,
      lastname,
      phone,
      email,
      username,
    });
    res.redirect("/show-users")
  } catch (error) {
    console.error("Error al actualizar el usuario", error);
    res.status(500).send("Error interno del servidor.");
  }
})

//rutas para productos
//mostrar todos los productos.
router.get('/new-product', async (req, res) => {

  res.render("newProduct")
})


//crear un nuevo producto
router.post('/new-product', async (req, res) => {
  const { productName, productDescription, productPrice, productCategory } = req.body;
  const file = req.file; // Obtiene el archivo de la solicitud
  try {
    // Sube la imagen a Firebase Storage
    const imageUrl = await uploadImageToStorage(file, file.originalname);

    // Guarda el producto en la base de datos junto con el nombre del archivo de la imagen
    await db.collection('products').add({
      productName,
      productDescription,
      productPrice,
      productCategory,
      imageName: file.originalname // Guarda el nombre del archivo de la imagen en la base de datos
    });

    res.redirect('/products');
  } catch (error) {
    console.error("Ha habido un error al crear el producto: ", error);
    res.status(500).send("Error interno en el servidor");
  }
});

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

router.get("/products", async (req, res) => {
  try {
    const querySnapshot = await db.collection('products').get();
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

    res.render('products', { products: resolvedProducts });
  } catch (error) {
    console.error("Error al obtener los productos: ", error);
    res.status(500).send("Error interno en el servidor");
  }
});
//rutas para pedidos
//mostrar todos los pedidos
router.get("/show-order", async(req,res)=>{
  //   const querySnapshot = await db.collection('users').get()
  //     const users = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //     }))
  //   res.render('showUsers',{users})
})
//crear nuevos pedidos
router.post("/new-order",async (req,res)=>{
  const{ userUid,date,branchUid,payMethod,total,productUid,quantity} = req.body;
  try {
    await db.collection('product').add({
      userUid,
      date,
      branchUid,
      payMethod,
      total,
      productUid,
      quantity
    })

    res.redirect('/show-order')

  } catch (error) {
    console.error("Ha habido un error al crear el producto: ", error);
    res.status(500).send("error interno en el servidor");
  }
})
//branch
module.exports = router;