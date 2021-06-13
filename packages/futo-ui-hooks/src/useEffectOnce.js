import { useEffect, useRef } from 'react'

const useEffectOnce = (fn, deps) => {
  const done = useRef(false);
  useEffect(() => !done.current && fn(() => done.current = true), deps);
}

export default useEffectOnce;
