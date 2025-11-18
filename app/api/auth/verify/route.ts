// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// ใช้ Prisma หรือ database ของคุณ
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// Demo database (ใช้ในการทดสอบก่อน)
const demoUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: '$2a$10$YourHashedPasswordHere', // bcrypt hash ของ "password"
    name: 'Test User',
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // ค้นหา user ในฐานข้อมูล (Prisma example)
    // const user = await prisma.user.findUnique({
    //   where: { email }
    // });

    // หรือใช้ demo database
    const user = demoUsers.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // ตรวจสอบ password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Return user data (ไม่ส่ง password กลับไป)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}