import { each } from '@futo-ui/utils'

import { useValues } from '.'
import reservedWordsCheck from './reservedWordsCheck'

const RESERVED_WORDS = ["clear", "delay"];

const useTimeouts = (initValues = {}) => {
  // Initialization check
  reservedWordsCheck(initValues, "useTimeouts", RESERVED_WORDS);

  // State
  const timeouts = useValues(initValues);

  // Functions
  const clear = name => name ? clearTimeout(timeouts[name]) : each(timeouts, t => clearTimeout(t)); 
  const delay = (name, delay) => { clear(name); return new Promise(r => timeouts.set(name, setTimeout(r, delay))); }

  // Return
  return { ...timeouts, clear, delay }
}

export default useTimeouts;
