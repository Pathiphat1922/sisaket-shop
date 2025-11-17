// lib/users-store.js - เก็บข้อมูลผู้ใช้ในหน่วยความจำ (ไม่เก็บถาวร)
import bcrypt from 'bcryptjs';

let users = [];

export async function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

export async function createUser({ email, phone, password, fullName }) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    id: Date.now().toString(),
    email,
    phone,
    password: hashedPassword,
    fullName,
    createdAt: new Date(),
  };

  users.push(newUser);
  return newUser;
}

export async function matchPassword(userPassword, enteredPassword) {
  return await bcrypt.compare(enteredPassword, userPassword);
}