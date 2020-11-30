import { useState } from 'react'

const useForm = ({ action }) => {
  const [state, setState] = useState(null);

  function handleSubmit(e) {
    e.preventDefault(); setState("loading");
    action({ fail: () => setState("error"), complete: () => setState("success") });
  }

  return { isLoading: state === "loading", isError: state === "error", isSuccess: state === "success", handleSubmit };
}

export default useForm;
