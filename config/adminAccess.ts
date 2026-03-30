export const ADMIN_EMAILS = [
  'admin1@afflosaur.com',
  'admin2@afflosaur.com',
  'admin3@afflosaur.com',
  'anmol4941j@gmail.com'
];

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
