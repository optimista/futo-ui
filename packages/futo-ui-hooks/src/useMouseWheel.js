import { useEffect } from 'react'

const useMouseWheel = ({ down, up }) => {
  const handleWheel = e => e.deltaY > 0 ? down() : up();
  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  });
}

export default useMouseWheel;
