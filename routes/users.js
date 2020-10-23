const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/me', getUserById);
usersRouter.patch('/users/me', updateUserProfile);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = {
  usersRouter,
};
