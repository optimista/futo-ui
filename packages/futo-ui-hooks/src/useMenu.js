import { useState } from 'react'

const useMenu = () => {
  const [el, setEl] = useState(null), [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const open = e => { setEl(e.currentTarget); setIsOpen(true); }
  return { isOpen, open, close, el };
}

export default useMenu
