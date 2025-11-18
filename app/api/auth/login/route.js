// app/api/auth/login/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // ตรวจสอบว่ากรอกข้อมูลครบ
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
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

    // ค้นหาผู้ใช้จากข้อมูลที่เก็บไว้ (จากการสมัครสมาชิก)
    if (!global.users) {
      global.users = [];
    }

    console.log('Users in system:', global.users); // debug
    console.log('Login attempt with email:', email); // debug

    const user = global.users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบผู้ใช้นี้ในระบบ' },
        { status: 401 }
      );
    }

    // ตรวจสอบรหัสผ่าน
    // ⚠️ ในการใช้งานจริง ต้อง compare hash password ด้วย bcrypt
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // สร้าง token (ตัวอย่างง่ายๆ)
    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    return NextResponse.json(
      {
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        token: token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}