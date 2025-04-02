const storage = {
  ref: () => ({
    child: (path: string) => ({
      put: async (file: File) => Promise.resolve(),
      delete: async () => Promise.resolve(),
      getDownloadURL: async () => "https://example.com/placeholder.jpg",
      getMetadata: async () => ({ name: "placeholder", contentType: "image/jpeg" })
    })
  })
};

// Upload a file to Firebase Storage
export const uploadToStorage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(path);
    
    await fileRef.put(file);
    const downloadUrl = await fileRef.getDownloadURL();
    
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading file to storage:', error);
    throw error;
  }
};

// Delete a file from Firebase Storage
export const deleteFromStorage = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const decodedUrl = decodeURIComponent(fileUrl);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    const filePath = decodedUrl.substring(startIndex, endIndex);
    
    const fileRef = storage.ref().child(filePath);
    await fileRef.delete();
    
    return true;
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    return false;
  }
};

// Upload multiple files and return array of URLs
export const uploadMultipleFiles = async (files: File[], basePath: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
      return uploadToStorage(file, path);
    });
    
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

// Get file metadata
export const getFileMetadata = async (fileUrl: string): Promise<any> => {
  try {
    const decodedUrl = decodeURIComponent(fileUrl);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    const filePath = decodedUrl.substring(startIndex, endIndex);
    
    const fileRef = storage.ref().child(filePath);
    const metadata = await fileRef.getMetadata();
    
    return metadata;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return null;
  }
};
