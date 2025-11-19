import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  },
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    // เพิ่ม path ที่ต้องการป้องกัน
  ]
};