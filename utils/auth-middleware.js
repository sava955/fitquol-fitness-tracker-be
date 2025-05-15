import jwt from "jsonwebtoken";
import { CreateError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return next(CreateError(401, "You are not authenticated!"));

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(CreateError(403, "Token is not valid"));
    } else {
      req.user = user;
      next();
    }
  });
};
