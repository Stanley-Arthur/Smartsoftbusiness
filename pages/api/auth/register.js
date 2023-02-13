import db from "@/utils/dbConnect";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST method is allowed" });
    return;
  }

  const {fullName, email, password } = req.body;

  await db.connect();

  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    res.status(409).json({ error: "Email already in used" });
    await db.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ user });
}

