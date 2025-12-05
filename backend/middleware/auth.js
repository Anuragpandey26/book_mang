import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }

  req.user = decoded;
  next();
};

export const authorizeLibrarian = (req, res, next) => {
  if (req.user.role !== 'librarian') {
    return res.status(403).json({ error: 'Access denied. Librarian role required' });
  }
  next();
};

export const authorizeSelfOrLibrarian = (req, res, next) => {
  const userId = parseInt(req.params.user_id || req.params.id);
  
  if (req.user.role === 'librarian' || req.user.id === userId) {
    return next();
  }
  
  return res.status(403).json({ error: 'Access denied' });
};
