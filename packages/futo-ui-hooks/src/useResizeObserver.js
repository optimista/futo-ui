import { useCallback, useRef } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

const subscriptions = {}; let resizeObserver;

const getResizeObserver = () => {
  if (!resizeObserver) resizeObserver = new ResizeObserver(entries => 
    entries.forEach(({ contentRect: { height: contentHeight, width: contentWidth }, target }) => {
      const { id } = target, { height, width } = target.getBoundingClientRect(), { onResize } = subscriptions[id] || {};
      onResize && onResize({ contentHeight, contentWidth, height, width });
    })
  );
  return resizeObserver;
};

const observe = (id, { element, onResize }) => {
  getResizeObserver().observe(element);
  subscriptions[id] = { element, onResize };
};

const unobserve = id => {
  getResizeObserver().unobserve(subscriptions[id].element);
  delete subscriptions[id];
};

const useResizeObserver = (id, { onResize = () => {} } = { onResize: () => {} }) => {
  const ref = useRef(null), setRef = useCallback(element => {
    if (element === null) { unobserve(id) } else { ref.current = element; observe(id, { element, onResize }) } }, []);
  return { ref, setRef };
}

export default useResizeObserver;
