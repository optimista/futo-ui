import { useState } from 'react'

class ReservedWordError extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
    this.message = message;
  }
}

const useModel = (initValues = {}) => {
  // Validity check
  const RESERVED_WORDS = ["set", "reset", "handleChange", "errors", "setErrors"];
  let keys = Object.keys(initValues);
  for (let i = 0; i < keys.length; i++) {
    if (RESERVED_WORDS.indexOf(keys[i]) != -1) {
      let message = "futo-ui/useModel: \""+keys[i]+"\" is RESERVED WORD. Use different name for your key.";
      throw new ReservedWordError(message);
    }
  }
  
  const [values, set] = useState(initValues);
  const [errors, setErrors] = useState({});

  function handleChange(name) { return e => { setErrors(errors => ({ ...errors, [name]: undefined })); set({ ...values, [name]: e.target.value }); } }
  function reset(callback = i => i) { set(callback(initValues)); }

  return { ...values, errors, set, setErrors, reset, values, handleChange };
}

export default useModel
