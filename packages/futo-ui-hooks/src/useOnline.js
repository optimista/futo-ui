import { useEffect, useState } from 'react'

const useOnline = () => {
  const [online, setOnline] = useState(null), update = () => setOnline(window.navigator.onLine);
  useEffect(() => {
    setOnline(window.navigator.onLine);
    window.addEventListener('online',  update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online',  update);
      window.removeEventListener('offline', update);
    }
  }, []);
  return online;
}
        
export default useOnline;
