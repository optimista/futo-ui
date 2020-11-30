import { useEffect } from 'react'

const useMouseWheel = ({ down, up }) => {
  const handleWheel = e => e.deltaY > 0 ? down() : up();
  useEffect(() => {
    window.addEventListener('mousewheel', handleWheel);
    return () => window.removeEventListener('mousewheel', handleWheel);
  });
}

export default useMouseWheel;
