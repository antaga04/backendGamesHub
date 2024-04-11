const isAdmin = (req, res, next) => {
  try {
    if (!req.user || !req.user.rol) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: 'Not admin' });
  }
};

module.exports = {
  isAdmin,
};
