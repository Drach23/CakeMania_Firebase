const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

router.get('/',userController.landingPage);
router.get('/show-users', userController.showUsers);
router.get('/register', userController.registerUserForm);
router.post('/new-user', userController.createUser);
router.get('/edit-user/:id', userController.editUserForm);
router.get('/confirmDelete-user/:id', userController.confirmDeleteUser);
router.post('/delete-user/:id', userController.deleteUser);
router.post('/update-user/:id', userController.updateUser);
router.get('/admin',userController.adminLanding);

module.exports = router;