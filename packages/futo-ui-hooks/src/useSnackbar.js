import { useState } from 'react'

import useModal from './useModal'

const useSnackbar = (initValue = "") => {
  const modal = useModal(false);
  const [message, set] = useState(initValue);
  const open = msg => { set(msg); modal.open(); };
  return { ...modal, open, message };
}

export default useSnackbar;
