const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) { // проверяем получили ли данные в нужном виде
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', ''); // извлекаем токен без слова Bearer

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    ); // попытаемся верифицировать токен
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' }); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = {
  auth,
};
