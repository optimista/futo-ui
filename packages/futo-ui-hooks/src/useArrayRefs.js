import { createRef, useEffect, useRef } from 'react'

const useArrayRefs = items => {
  const refs = useRef(items.concat([null]).map(() => createRef()));
  useEffect(() => { refs.current = items.concat([null]).map((_, i) => refs.current[i] || createRef()) }, [items]);
  return refs.current;
}

export default useArrayRefs;
