import { isevent, isfunction } from '@futo-ui/utils'

import { useModal } from '.'

const useDialog = (model, initState) => {
  const modal = useModal(false);
  return { ...modal, open: arg => { model && model.reset(isevent(arg) ? (isfunction(initState) ? initState() : initState) : arg); modal.open() } }; 
}

export default useDialog;
