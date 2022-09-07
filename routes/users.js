const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validUserId,
  validUpdateUser,
  validUpdateAvatar,
} = require('../middlewares/validators');

router.get('/', getUsers);
router.get('/:id', validUserId, getUserById);
router.post('/', createUser);
router.patch('/me', validUpdateUser, updateUser);
router.patch('/me/avatar', validUpdateAvatar, updateAvatar);

module.exports = router;
