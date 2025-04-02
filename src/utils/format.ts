export const firebaseUIDToUUID = (uid: string): string => {
  if (!uid) return '';
  
  // Check if already UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(uid)) return uid;

  // Convert Firebase UID to UUID v4 format
  const cleanUid = uid.replace(/-/g, '').slice(0, 32);
  const uuid = cleanUid.padEnd(32, '0');
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-4${uuid.slice(13, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20, 32)}`;
};