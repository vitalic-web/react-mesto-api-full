const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // console.log(`This is authorization: ${authorization}`);

  if (!authorization || !authorization.startsWith('Bearer ')) { // проверяем получили ли данные в нужном виде
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', ''); // извлекаем токен без слова Bearer

  // console.log(`This is token: ${token}`);

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key'); // попытаемся верифицировать токен
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' }); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  // console.log(`This is req.user: ${req.user}`);

  next(); // пропускаем запрос дальше
};

module.exports = {
  auth,
};
