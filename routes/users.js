const usersRouter = require('express').Router();
const {
  getAllUsers, getUserById, getUserByIdInParams, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');
const { validateUserProfile, validateUserAvatar, validateUserIdParams } = require('../middlewares/reqValidation');

usersRouter.get('/users', getAllUsers);
usersRouter.get('/users/me', getUserById);
usersRouter.get('/users/:userId', validateUserIdParams, getUserByIdInParams);
usersRouter.patch('/users/me', validateUserProfile, updateUserProfile);
usersRouter.patch('/users/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = {
  usersRouter,
};
