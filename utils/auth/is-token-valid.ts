import jwt, { JwtPayload } from "jsonwebtoken";

export function isTokenValid(token: string): JwtPayload | false {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded;
  } catch (error) {
    return false;
  }
}
