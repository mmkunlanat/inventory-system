import jwt from "jsonwebtoken";

const SECRET = "mysecretkey"; // โปรเจกต์เรียนใช้ได้

export function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
