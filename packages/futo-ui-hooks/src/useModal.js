import { useState } from 'react'

const useModal = (initValue = false) => {
  const [isOpen, set] = useState(initValue);
  const close = () => set(false);
  const open = () => set(true);
  return { isOpen, open, close }; 
}

export default useModal;
