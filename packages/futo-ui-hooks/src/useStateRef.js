import { useEffect, useRef } from 'react'

const useStateRef = state => {
  const ref = useRef(null);
  useEffect(() => { ref.current = state; }, [state]);
  return ref;
}

export default useStateRef;
