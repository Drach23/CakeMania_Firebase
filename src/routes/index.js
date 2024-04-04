const {Router} = require('express')
const {db} = require('../firebase')

const router = Router()

//Landing page
router.get('/',async(req,res)=>{
  res.render('index')
})

//Login page
router.get('/login',async (req,res)=>{
  res.render('login')
})

//mostrar usuarios
router.get('/show-users',async (req,res)=>{
  const querySnapshot = await db.collection('user').get()
    const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    
  res.render('showUsers',{users})
})

/*
En esta seccion se encuentran los endpoint para usuarios.
*/
//Peticion get
router.get('/register', async(req,res) =>{//Aqui se obtienen los datos de usuarios desde firebase.
  
    res.render('register')
  })

 
  //peticiones post
  router.post('/new-user', async (req,res) => {
    const {firstname,lastname,phone ,email ,username , password } =  req.body

    await db.collection('user').add({
        firstname,
        lastname,
        phone,
        email,
        username,
        password,
    })

    res.redirect('/')
  })

  //findUserById
  router.get('/edit-user/:id', async (req,res)=>{
   const doc =  await db.collection('user').doc(req.params.id).get()

   res.render('editDialog',{user: {id: doc.id, ...doc.data()}})

  })

  //peticiones delete con confirmacion
  router.get('/confirmDelete-user/:id', async (req,res)=>{
    const doc = await db.collection('user').doc(req.params.id).get()
    res.render('deleteDialog',{user: {id: doc.id, ...doc.data()}})
  })

  //delete despues de confirmar
  router.post('/delete-user/:id', async (req, res) => {
    const id = req.params.id.trim();

    try {
        await db.collection('user').doc(id).delete();
        res.redirect('/show-users');
    } catch (error) {
        console.error("Error al eliminar el usuario", error);
        res.status(500).send("Error interno del servidor.");
    }
});
  
  //peticiones put (editar con id)
  router.post('/update-user/:id', async (req,res)=>{
    const {firstname, lastname, email,phone, username} = req.body;
    const id = req.params.id.trim() //elimina espacios en blanco;
    try{
      const userRef = db.collection("user").doc(id);
      const userDoc = await userRef.get();

      if(!userDoc.exists){
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
    }catch(error){
      console.error("Error al actualizar el usuario",error);
      res.status(500).send("Error interno del servidor.");
    }
  })
  module.exports = router