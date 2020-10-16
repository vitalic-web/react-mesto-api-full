const usersRouter = require('express').Router();
const {
  getAllUsers, createUser, getUserById, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getAllUsers);
usersRouter.post('/users', createUser);
usersRouter.get('/users/:userId', getUserById); // userId присваивается в req.params, т.е. req.params.userId
// вместо userId можно любое слово, например id, тогда будет req.params.id
usersRouter.patch('/users/me', updateUserProfile);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = {
  usersRouter,
};
