const { Router } = require('express')
const { db } = require('../firebase')
const multer = require('multer');
const { uploadImageToStorage } = require('../public/js/imageUpload.js');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');





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