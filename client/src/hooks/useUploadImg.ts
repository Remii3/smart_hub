import { v4 } from 'uuid';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImgTargets } from '@customTypes/types';

interface PropsTypes {
  selectedFile: File | null;
  targetLocation: ImgTargets;
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
  if (targetLocation === 'ProfileImg') {
    const imgRef = ref(storage, `${targetLocation}/${ownerId}/${prodImgId}`);

    return uploadBytes(imgRef, selectedFile).then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        return { url, id: prodImgId };
      });
    });
  } else if (targetLocation === 'ProductImgs') {
    const imgRef = ref(storage, `${targetLocation}/${ownerId}/${prodImgId}`);
    return uploadBytes(imgRef, selectedFile).then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        return { url, id: prodImgId };
      });
    });
  } else if (targetLocation === 'NewsImg') {
    const imgRef = ref(storage, `${targetLocation}/${ownerId}/${prodImgId}`);

    return uploadBytes(imgRef, selectedFile).then((snapshot) => {
      return getDownloadURL(snapshot.ref).then((url) => {
        return { url, id: prodImgId };
      });
    });
  }
}
