import { useEffect, useState } from 'react';

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState<number | undefined>(0);

  useEffect(() => {
    const testScroll = document.getElementById('testScroll');

    const updatePosition = () => {
      setScrollPosition(testScroll?.scrollTop);
    };
    testScroll?.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => {
      testScroll?.removeEventListener('scroll', updatePosition);
    };
  }, []);
  return scrollPosition;
}

export default useScrollPosition;
