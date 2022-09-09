const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validUserId,
  validUpdateUser,
  validUpdateAvatar,
} = require('../middlewares/validators');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:id', validUserId, getUserById);
router.patch('/me', validUpdateUser, updateUser);
router.patch('/me/avatar', validUpdateAvatar, updateAvatar);

module.exports = router;
