import jwt from 'jsonwebtoken';

export const authRequired = (roles = []) => {
  const rolesArray = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    // Allow OPTIONS requests to pass through for CORS preflight
    if (req.method === 'OPTIONS') {
      return next();
    }
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.substring(7) : null;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
      req.user = payload;
      if (rolesArray.length && !rolesArray.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};


