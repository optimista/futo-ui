import { useRef, useState } from 'react'

import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

const useDimensions = () => {
  const ref = useRef();
  const [dimensions, setDimensions] = useState({});
  useIsomorphicLayoutEffect(() => { setDimensions(ref.current.getBoundingClientRect()); }, [ref.current]);
  return [ref, dimensions];
}

export default useDimensions;
