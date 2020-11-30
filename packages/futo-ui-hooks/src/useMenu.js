import { useState } from 'react'

const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);
  const handleOpen = e => setAnchorEl(e.currentTarget);

  return [anchorEl, isOpen, handleOpen, handleClose];
}

export default useMenu
