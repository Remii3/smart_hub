import { storage } from '../firebase';
import { ref, deleteObject } from 'firebase/storage';

type Targets = 'Profile_img' | 'Product_imgs' | 'News_img';

interface PropsTypes {
  targetLocation: Targets;
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
