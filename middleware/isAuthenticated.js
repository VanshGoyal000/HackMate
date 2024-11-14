// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/auth/login');
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.clearCookie('token');
      res.redirect('/auth/login');
    }
  };
module.exports = {isAuthenticated}  