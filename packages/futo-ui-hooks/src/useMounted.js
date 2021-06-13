import { useEffect, useRef } from 'react'

const useMounted = () => {
  const mounted = useRef(true);
  useEffect(() => () => mounted.current = false, []);
  return mounted;
}

export default useMounted;
