import { capitalize, equal, keys, map } from '@futo-ui/utils'

import reservedWordsCheck from './reservedWordsCheck'
import { useForm, useValidators, useValues } from '.'

const RESERVED_WORDS = ["main", "reset", "error", "errors", "isChanged", "isInvalid", "handleChange", "handleSubmit", "isValidated", "isValidating", "helperText", "fail", "success", "isSending", "isFail", "isSuccess", "validatesInline", "refs"];

const useModel = (initValues = {}, { onSubmit = () => {}, validation = {} } = { onSubmit: () => {}, validation: {} }) => {
  // Initialization check
  reservedWordsCheck(initValues, "useModel", RESERVED_WORDS);
  
  const values = useValues(initValues);
  const errors = useValues(map(initValues, () => null));
  const validators = useValidators(validation);
  const form = useForm(initValues);
  const resetValues = useValues(initValues);

  const handleChange = name => e => {
    const { value } = e.target; values.set(name, value);
    if (form.isFail) { 
      errors.set("main", null); errors.set(name, null);
      validators.validate(name, value).catch(newErrs => errors.set(errs => ({ ...errs, ...newErrs })));
    }
  }
 
  const handleSubmit = e => {
    e.preventDefault();

    if (!isInvalid) {
      errors.set("main", null); form.sending();
      validators.validate(values).then(onSubmit, fail);
    }
  }

  const error = errors["main"];
  const fail = errs => { form.fail(); errors.set(v => ({ ...v, ...errs })); form.select(keys(errs).filter(v => v !== "main")[0]); }
  const helperText = (name, label) => errors[name] || (label || capitalize(name));
  const isChanged = !equal(values.values, resetValues.values); 
  const isInvalid = !validators.validateSilently(values);
  const reset = (newValues = initValues) => { 
    resetValues.set(newValues); errors.set(map(newValues, () => null));
    values.set(newValues); form.reset(); validators.reset();
  }

  const { isSending, isFail, isSuccess, refs, success } = form,
        { isValidated, isValidating, validatesInline } = validators;

  return { ...values, reset, errors, helperText, isChanged, isInvalid, handleChange, handleSubmit, fail, success, isValidated, isValidating, error, isSending, isFail, isSuccess, validatesInline, refs };
}

export default useModel
