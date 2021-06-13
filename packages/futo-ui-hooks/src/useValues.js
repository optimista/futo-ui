import { useState } from 'react'

import reservedWordsCheck from './reservedWordsCheck'

const RESERVED_WORDS = ["set", "has", "values"];

const useValues = (initValues = {}) => {
  // Initialization check
  reservedWordsCheck(initValues, "useValues", RESERVED_WORDS);

  // State
  const [values, setValues] = useState(initValues);

  // Functions
  const set = (...args) => {
    switch(args.length) {
      case 1: return setValues(...args); // set({ ... })
      case 2: return setValues(v => ({ ...v, [args[0]]: args[1] })); // set(name, value); 
    }
  } 
  const has = key => values[key] !== undefined && values[key] !== null;

  // Return
  return { ...values, set, has, values };
}

export default useValues;
