const {Router} = require('express')
const {db,auth} = require('../firebase')


const router = Router()

//Landing page
router.get('/',async(req,res)=>{
  res.render('index')
})

//Login page
router.get('/login',async (req,res)=>{
  res.render('login')
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    // Autenticación exitosa, puedes redirigir a otra página o enviar una respuesta adecuada
    res.redirect('');
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.render('login', { errorMessage: 'Error al iniciar sesión. Por favor, verifica tu correo electrónico y contraseña.' });
  }
});

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

    try{
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: `${firstname} ${lastname}` 
      });

    await db.collection('user').add({
        firstname,
        lastname,
        phone,
        email,
        username,
        password,
    });

  }catch(error){
    console.error("Ha habido un error al crear al usuario", error);
    res.status(500).send("error interno en el servidor");
  };


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