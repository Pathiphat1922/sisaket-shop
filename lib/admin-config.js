export const ADMIN_PASSWORDS = [
  'your_admin_password_12345678',
  'backup_password_456'
];

// ฟังก์ชันตรวจสอบรหัสผ่าน
export function verifyAdminPassword(password) {
  return ADMIN_PASSWORDS.includes(password);
}

// ฟังก์ชันเพิ่มรหัสใหม่
export function addAdminPassword(newPassword) {
  if (!ADMIN_PASSWORDS.includes(newPassword)) {
    ADMIN_PASSWORDS.push(newPassword);
    return true;
  }
  return false;
}

// ฟังก์ชันลบรหัส
export function removeAdminPassword(password) {
  const index = ADMIN_PASSWORDS.indexOf(password);
  if (index > -1) {
    ADMIN_PASSWORDS.splice(index, 1);
    return true;
  }
  return false;
}