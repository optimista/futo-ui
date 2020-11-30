import { useState } from 'react'

const useDialog = (initValue = false) => {
  const [open, setOpen] = useState(initValue);
  function handleClose() { setOpen(false); }
  function handleOpen() { setOpen(true); }
  return [open, handleOpen, handleClose];
}

export default useDialog;
