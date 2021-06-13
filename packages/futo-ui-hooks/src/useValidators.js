import { arrayize, empty, isfunction, keys, last, map, uniq } from '@futo-ui/utils'

import { useTimeouts, useValues } from '.'

const structurize = v => arrayize(v).map(v => isfunction(v) ? { f: v } : v);

const useValidators = ({ disableInline = false, generalError = () => {}, silentValidators: initSilentValidators = {}, syncValidators: initSyncValidators = {}, asyncValidators: initAsyncValidators = {}} = { disableInline: false, handleError: () => {}, silentValidators: {}, syncValidators: {}, asyncValidators: {} }) => {
  const syncValidators = map(initSyncValidators, structurize); 
  const asyncValidators = map(initAsyncValidators, structurize); 
  const silentValidators = map(initSilentValidators, structurize); 

  // Validation
  const timeouts = useTimeouts({});
  const state = useValues(map({ ...syncValidators, ...asyncValidators }, () => useValidators.IDLE));
  
  const runValidators = async (key, value) => {
    const syncVals = syncValidators[key] || [];
    for (let i = 0; i < syncVals.length; i++) { const { f, message, title } = syncVals[i]; if (!f(value)) return Promise.resolve({ message, title }); }
    return Promise.all((asyncValidators[key] || []).map(({ f, message, title }) => 
      f(value).then(res => res ? null : { message, title }))).then(errs => last(errs))
        .catch(err => Promise.reject(generalError(err)));  // if there's mistake in evaluating errors themselves, reject with a generalError
  }

  const validateAll = async values => { 
    timeouts.clear(); const ks = uniq(keys(syncValidators).concat(keys(asyncValidators)));
    return Promise.all(ks.map(k => runValidators(k, values[k]))).then(vs => {
              const errs = vs.reduce((obj, cur, i) => cur ? { ...obj, [ks[i]]: cur } : obj, {});
              state.set(v => map(v, () => useValidators.VALIDATED));
              if (!empty(errs)) return Promise.reject(errs);
            }) 
  };

  const validateField = async (key, value) => { 
    if (validatesInline(key)) {
      state.set(key, useValidators.VALIDATING);
      return timeouts.delay(key, 1000).then(() => runValidators(key, value))
        .catch(errs => { state.set(key, useValidators.IDLE); return Promise.reject(errs); })
        .then(err => { state.set(key, useValidators.VALIDATED); return Promise.reject({ [key]: err });
      });
    } else { return Promise.resolve({}); }
  }; 

  const validate = (...args) => {
    switch(args.length) {
      case 1: return validateAll(...args); // validate({ [name]: value, ... })
      case 2: return validateField(...args); // validate(name, value); 
    }
  }

  const isValidated = name => state[name] === useValidators.VALIDATED;
  const isValidating = name => state[name] === useValidators.VALIDATING;
  const reset = () => state.set(map({ ...syncValidators, ...asyncValidators }, () => useValidators.IDLE));
  const validatesInline = name => !disableInline && 0 < (syncValidators[name] || []).concat(asyncValidators[name] || []).length;
  const validateSilently = values => { for (const k in silentValidators) {
    for (const { f } of silentValidators[k]) { let r; try { r = f(values[k]); } catch(_) { return false; } if (!r) return false; }
  } return true; };

  // Return
  return { reset, validate, isValidated, isValidating, validatesInline, validateSilently }
}

useValidators.IDLE = "IDLE";
useValidators.VALIDATING = "VALIDATING";
useValidators.VALIDATED = "VALIDATED";

export default useValidators;
