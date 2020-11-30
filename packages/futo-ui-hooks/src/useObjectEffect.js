import { equal } from '@futo-ui/utils'
import { useEffect, useRef } from 'react'

const useObjectEffect = (fn, deps) => {
  const prevDeps = useRef(deps);

  useEffect(() => {
    if (!prevDeps.current.every((obj, i) => equal(obj, deps[i]))) fn();
    prevDeps.current = deps;
  }, deps);
} 

export default useObjectEffect;
