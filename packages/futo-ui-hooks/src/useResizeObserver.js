import { useCallback } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

const subscriptions = {}; let resizeObserver;

const getResizeObserver = () => {
  if (!resizeObserver) resizeObserver = new ResizeObserver(entries => 
    entries.forEach(({ contentRect, target }) => {
      const { id } = target, { onResize } = subscriptions[id] || {};
      onResize && onResize(contentRect);
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

const useResizeObserver = (id, { onResize = () => {} } = { onResize: () => {} }) =>
  useCallback(element => element === null ? unobserve(id) : observe(id, { element, onResize }), []);

export default useResizeObserver;
