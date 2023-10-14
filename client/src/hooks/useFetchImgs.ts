import { storage } from '../firebase';
import { ref, listAll } from 'firebase/storage';

type Targets = 'Profile_img' | 'Product_imgs' | 'News_img';

interface PropsTypes {
  targetLocation: Targets;
  ownerId: string | undefined;
}

export default function useFetchImgs({ targetLocation, ownerId }: PropsTypes) {
  if (!targetLocation || !ownerId) return null;
  const imgRef = ref(storage, `${targetLocation}/${ownerId}`);
  return listAll(imgRef);
}
