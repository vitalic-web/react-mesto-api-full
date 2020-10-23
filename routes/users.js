const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');
const { validateUserProfile, validateUserAvatar } = require('../middlewares/reqValidation');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/me', getUserById);
usersRouter.patch('/users/me', validateUserProfile, updateUserProfile);
usersRouter.patch('/users/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = {
  usersRouter,
};
