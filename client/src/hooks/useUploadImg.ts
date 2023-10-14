import { v4 } from 'uuid';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type Targets = 'Profile_img' | 'Product_imgs' | 'News_img';

interface PropsTypes {
  selectedFile: File | null;
  targetLocation: Targets;
  ownerId: string | undefined;
  currentId?: string;
}

export default function useUploadImg({
  selectedFile,
  targetLocation,
  ownerId,
  currentId,
}: PropsTypes) {
  if (!targetLocation || !selectedFile || !ownerId) return null;
  let prodImgId = '';
  if (currentId) {
    prodImgId = currentId;
  } else {
    prodImgId = v4();
  }
  if (targetLocation === 'Profile_img') {
    const imgRef = ref(storage, `${targetLocation}/${ownerId}/${prodImgId}`);

    return uploadBytes(imgRef, selectedFile).then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        return { url, id: prodImgId };
      });
    });
  } else if (targetLocation === 'Product_imgs') {
    const imgRef = ref(storage, `${targetLocation}/${ownerId}/${prodImgId}`);
    return uploadBytes(imgRef, selectedFile).then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        return { url, id: prodImgId };
      });
    });
  } else if (targetLocation === 'News_img') {
    const imgRef = ref(storage, `${targetLocation}/${ownerId}/${prodImgId}`);

    return uploadBytes(imgRef, selectedFile).then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        return { url, id: prodImgId };
      });
    });
  }
}
