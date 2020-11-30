import { delta } from '@futo-ui/utils'
import { useState } from 'react'

import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

const useDrag = ({ onMouseMove, onMouseUp } = {}) => {
  const [prevMouseXY, setPrevMouseXY] = useState(null),
        [isDragged, setIsDragged] = useState(false),
        mouseXY = e => ({ x: e.screenX, y: e.screenY }),
        dragStart = e => setPrevMouseXY(mouseXY(e)),
        handleMouseDown = e => e.button === 0 && dragStart(e),
        handleTouchStart = e => e.changedTouches.length === 1 && dragStart(e.changedTouches[0]);

  const mousemove = e => {
    if (prevMouseXY) {
      const d = delta(mouseXY(e), prevMouseXY); setPrevMouseXY(mouseXY(e)); setIsDragged(true);
      onMouseMove && onMouseMove({ target: { value: d } });
    }
  }

  const mouseup = e => {
    if (prevMouseXY) {
      const d = delta(mouseXY(e), prevMouseXY); setPrevMouseXY(null); setIsDragged(false);
      onMouseUp && onMouseUp({ target: { value: d } });
    }
  }

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    return () => {
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    }
  }, [prevMouseXY])
  
  return { handleMouseDown, handleTouchStart, isDragged };
}

export default useDrag
