// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { fullName, email, phone, password } = await request.json();

    // ตรวจสอบว่ากรอกข้อมูลครบ
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าเบอร์โทรศัพท์เป็นตัวเลข
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'เบอร์โทรศัพท์ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ตรวจสอบความยาวรหัสผ่าน
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      );
    }

    // *** หากใช้ Database ***
    // ตัวอย่างใช้ MongoDB หรือ Prisma
    // const user = await db.user.create({
    //   data: {
    //     fullName,
    //     email,
    //     phone,
    //     password: hashedPassword, // ต้อง hash รหัสผ่าน
    //   },
    // });

    // *** ตัวอย่างไม่มี Database (ทดลองใช้ก่อน) ***
    // เก็บข้อมูลในตัวแปร (จะหายเมื่อ server restart)
    if (!global.users) {
      global.users = [];
    }

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingUser = global.users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'อีเมลนี้ได้ลงทะเบียนแล้ว' },
        { status: 400 }
      );
    }

    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // เพิ่มผู้ใช้ใหม่
    const newUser = {
      id: Date.now().toString(),
      fullName,
      email,
      phone,
      password: hashedPassword, // ✅ บันทึกเป็น hash แล้ว
      createdAt: new Date().toISOString(),
    };

    global.users.push(newUser);

    console.log('User registered:', {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'สมัครสมาชิกสำเร็จ',
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}