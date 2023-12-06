import { ImgTargets } from '@customTypes/types';
import { storage } from '../firebase';
import { ref, deleteObject } from 'firebase/storage';

interface PropsTypes {
  targetLocation: ImgTargets;
  ownerId: string;
  imgId: string;
}

export default function useDeleteImg({
  targetLocation,
  ownerId,
  imgId,
}: PropsTypes) {
  if (!targetLocation || !ownerId) return null;
  const imgRef = ref(storage, `${targetLocation}/${ownerId}/${imgId}`);
  return deleteObject(imgRef);
}
