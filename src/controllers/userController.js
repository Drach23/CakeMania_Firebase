
const { db } = require('../firebase');
const router = require('../routes');


exports.landingPage = async(req,res)=>{
  res.render('index')
}

exports.showUsers = async (req, res) => {
  try {
    const querySnapshot = await db.collection('users').get();
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.render('showUsers', { users });
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).send("Error interno en el servidor");
  }
};

exports.registerUserForm = async (req, res) => {
  res.render('register');
};

exports.showIndex = async (req,res) =>{
    res.render('index');
};
exports.showLoginForm = async (req,res) =>{
    res.render('login')
};

exports.loginUser = async (req, res) => {
    
  };

exports.createUser = async (req, res) => {
  const { firstname, lastname, phone, email, username, password } = req.body;
  try {
    await db.collection('users').add({
      firstname,
      lastname,
      phone,
      email,
      username,
      password,
    });
    res.redirect('/');
  } catch (error) {
    console.error("Ha habido un error al crear al usuario", error);
    res.status(500).send("Error interno en el servidor");
  }
};

exports.editUserForm = async (req, res) => {
  const doc = await db.collection('users').doc(req.params.id).get();
  res.render('editDialog', { user: { id: doc.id, ...doc.data() } });
};

exports.confirmDeleteUser = async (req, res) => {
  const doc = await db.collection('users').doc(req.params.id).get();
  res.render('deleteDialog', { user: { id: doc.id, ...doc.data() } });
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id.trim();
  try {
    await db.collection('users').doc(id).delete();
    res.redirect('/show-users');
  } catch (error) {
    console.error("Error al eliminar el usuario", error);
    res.status(500).send("Error interno del servidor");
  }
};

exports.updateUser = async (req, res) => {
  const { firstname, lastname, email, phone, username } = req.body;
  const id = req.params.id.trim();
  try {
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).send("Usuario no encontrado");
    }
    await userRef.update({
      firstname,
      lastname,
      phone,
      email,
      username,
    });
    res.redirect("/show-users");
  } catch (error) {
    console.error("Error al actualizar el usuario", error);
    res.status(500).send("Error interno del servidor");
  }
};

exports.adminLanding = async (req, res) => {
  res.render("adminLanding")
  };

  exports.cart =async(req,res)=>{
    res.render("shoppingCart")
  }
