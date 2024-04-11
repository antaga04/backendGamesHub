const { verifytoken } = require('../utils/jwt');

const hasValidAuthJwt = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [, token] = authorization.split(' ');
    const payload = verifytoken(token);

    req.user = payload;
    console.log(payload);

    next();
  } catch (err) {
    res.status(401).json({ data: 'Not authenticated' });
  }
};

module.exports = {
  hasValidAuthJwt,
};
