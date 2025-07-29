export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(401).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
    }
    next();
  };
};
