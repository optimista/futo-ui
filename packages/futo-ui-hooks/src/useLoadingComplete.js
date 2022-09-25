import { useState } from 'react'

const useLoadingComplete = (initValue = false) => {
  const [loaded, setLoaded] = useState(initValue);
  return [loaded, () => setLoaded(true)];
}

export default useLoadingComplete;
