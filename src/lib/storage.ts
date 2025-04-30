
import { storage } from '@/lib/firebase';
export { storage };

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadToStorage(file: File): Promise<string> {
  const filename = `products/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filename);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return url;
}
