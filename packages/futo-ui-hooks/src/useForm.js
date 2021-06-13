import { useObjectRefs } from '@futo-ui/hooks'
import { keys } from '@futo-ui/utils'
import { useState } from 'react'

const useForm = fields => {
  const refs = useObjectRefs(fields), 
        [state, set] = useState(useForm.IDLE),
        [isSending, setSending] = useState(false);

  const isFail = state === useForm.FAIL;
  const isSuccess = state === useForm.SUCCESS;

  const focus = (key = keys(refs)[0]) => refs[key].current?.focus();
  const select = (key = keys(refs)[0]) => refs[key].current?.select();

  const fail = () => { set(useForm.FAIL); setSending(false); } 
  const reset = () => { set(useForm.IDLE); setSending(false); }
  const sending = () => setSending(true);
  const success = () => { set(useForm.SUCCESS); setSending(false); }

  return { reset, refs, isSending, isFail, isSuccess, sending, fail, success, focus, select };
}

useForm.IDLE = "IDLE"
useForm.FAIL = "FAIL"
useForm.SUCCESS = "SUCCESS"

export default useForm;
