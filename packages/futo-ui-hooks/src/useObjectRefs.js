import { entries, maxKey, object } from '@futo-ui/utils'
import { createRef, useEffect, useRef } from 'react'

const useObjectRefs = items => {
  const refs = useRef(object(entries(items).concat([[maxKey(items) + 1, null]]).map(e => [e[0], createRef()])));
  useEffect(() => { refs.current = object(entries(items).concat([[maxKey(items) + 1, null]]).map(e => [e[0], refs.current[e[0]] || createRef()])) }, [items]);
  return refs.current;
}

export default useObjectRefs;
