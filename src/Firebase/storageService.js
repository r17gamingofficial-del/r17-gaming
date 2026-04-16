import { storage } from "./config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads an image to Firebase Storage and returns the download URL
 * @param {File} file 
 * @returns {Promise<string>} Download URL
 */
export const uploadImage = async (file) => {
  if (!file) return null;
  
  try {
    const storageRef = ref(storage, `carousel/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
