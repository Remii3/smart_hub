import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

type Targets = 'Profile_img' | 'Product_imgs';

interface PropsTypes {
  selectedFile: File | null;
  targetLocation: Targets;
  ownerId: string | undefined;
  iteration?: number;
}

export default function useUploadImg({
  selectedFile,
  targetLocation,
  ownerId,
  iteration,
}: PropsTypes) {
  if (!targetLocation || !selectedFile || !ownerId) return null;
  if (targetLocation === 'Profile_img') {
    const imgRef = ref(storage, `${targetLocation}/${ownerId}`);

    return uploadBytes(imgRef, selectedFile).then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        return url;
      });
    });
  } else if (targetLocation === 'Product_imgs') {
    const imgRef = ref(storage, `${targetLocation}/${ownerId}/${iteration}`);
    return uploadBytes(imgRef, selectedFile).then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        return url;
      });
    });
  }
}
