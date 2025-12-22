import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI || "NOT SET";
console.log("MONGODB_URI starting with:", uri.substring(0, 20) + "...");
console.log("JWT_SECRET is:", process.env.JWT_SECRET ? "SET" : "NOT SET");
