import { useRouter } from 'next/router'
import { useEffect } from 'react'

//https://stackoverflow.com/questions/63064778/next-js-warn-user-for-unsaved-form-before-route-change
const useBeforeUnload = (confirmationMessage, isUnsaved) => {
  const router = useRouter();

  useEffect(() => {
    const beforeRouteHandler = url => {
      if (router.pathname !== url && !confirm(confirmationMessage)) {
        // to inform NProgress or something ...
        router.events.emit('routeChangeError');
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };
    
    const beforeUnloadHandler = e => {
      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
    };

    if (isUnsaved) {
      router.events.on('routeChangeStart', beforeRouteHandler);
      window.addEventListener('beforeunload', beforeUnloadHandler);
    } else {
      router.events.off('routeChangeStart', beforeRouteHandler);
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    }

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      router.events.off('routeChangeStart', beforeRouteHandler);
    };
  }, [isUnsaved]);
}

export default useBeforeUnload;
