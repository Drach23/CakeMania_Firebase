const {Router} = require('express')
const {db} = require('../firebase')

const router = Router()

//peticiones get
router.get('/users', async(req,res) =>{

    const querySnapshot = await db.collection('user').get()
    const contacts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    console.log(contacts)

    res.send("Helou")
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

    res.send("new contact created")
  })

  module.exports = router