import { v5 as uuidv5 } from 'uuid';

// Define a namespace UUID for consistent UUID generation
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // DNS namespace

export const firebaseUIDToUUID = (uid: string): string => {
  if (!uid) return '';
  
  // Check if already UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(uid)) return uid;

  // Use UUID v5 to generate a deterministic UUID based on the Firebase UID
  // This ensures the same Firebase UID always generates the same UUID
  // and the UUID is in a format that Supabase expects
  return uuidv5(uid, NAMESPACE);
};