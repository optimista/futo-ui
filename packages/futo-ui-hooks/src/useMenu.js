import { useState } from 'react'

const useMenu = () => {
  const [el, set] = useState(null);
  const close = () => set(null);
  const open = e => set(e.currentTarget);
  const isOpen = Boolean(el);
  return { isOpen, open, close, el };
}

export default useMenu
