import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Unauthorized access");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
    };
    next();
  } catch (error) {
    return res.status(403).send("Invalid token");
  }
};
