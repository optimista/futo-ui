import { useEffect, useReducer, useRef } from 'react'

const reducer = (state, action) => {
  switch(action.type) {
    case "NOTIFICATION_HIDE":
      return { ...state, notify: false }
    case "SUCCESS":
      return { ...state, pending: false, notify: true }
    case "TRIGGER":
      return { ...state, pending: true, trigger: !state.trigger }
    default: 
      return state;
  }
}

const useAutosave = ({ autosaveTimeout = 5000, notifyTimeout = 5000, query = () => {} }) => {
  const [{ notify, pending, trigger }, dispatch] = useReducer(reducer, { notify: false, pending: false, trigger: false }),
        timer = useRef(null);

  useEffect(() => {
    if (pending) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        query().then(() => {
          dispatch({ type: "SUCCESS" }); setTimeout(() => dispatch({ type: "NOTIFICATION_HIDE" }), notifyTimeout);
        })}, autosaveTimeout);
    }
  }, [trigger]);

  return { dispatch, notify };
}

export default useAutosave;
