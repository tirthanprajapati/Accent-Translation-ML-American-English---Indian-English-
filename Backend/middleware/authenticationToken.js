const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key'; // Replace with a secure key or load from process.env

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    return res
      .status(401)
      .json({ error: { code: 'UNAUTHORIZED', message: 'Access token missing' } });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, JWT_SECRET };