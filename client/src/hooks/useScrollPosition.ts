import { useEffect, useState } from 'react';

function useScrollPosition(elementId: string) {
  const [scrollPosition, setScrollPosition] = useState<number | undefined>(0);

  useEffect(() => {
    const scrollPosition = document.getElementById(elementId);

    const updatePosition = () => {
      setScrollPosition(scrollPosition?.scrollTop);
    };

    scrollPosition?.addEventListener('scroll', updatePosition);

    updatePosition();

    return () => {
      scrollPosition?.removeEventListener('scroll', updatePosition);
    };
  }, []);
  return scrollPosition;
}

export default useScrollPosition;
