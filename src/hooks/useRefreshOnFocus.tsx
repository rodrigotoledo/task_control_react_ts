import { useEffect, useRef } from 'react';

type RefetchFunction = () => void;

export function useRefreshOnFocus(refetch: RefetchFunction) {
  const firstTimeRef = useRef<boolean>(true);

  useEffect(() => {
    const handleFocus = () => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetch]);
}
