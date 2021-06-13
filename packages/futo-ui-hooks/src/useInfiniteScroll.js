import { useEffect, useState } from 'react'

const useInfiniteScroll = ({ fetching: fetchingInit = false, hasMore: hasMoreInit = false, threshold = 200 }) => {
  const [fetching, setFetching] = useState(fetchingInit);
  const [hasMore, setHasMore] = useState(hasMoreInit);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetching, hasMore]);

  function handleScroll() {
    const offsetHeight = document.documentElement.offsetHeight, innerHeight = window.innerHeight,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (!hasMore || fetching || innerHeight + scrollTop + threshold <= offsetHeight) return;
    setFetching(true);
  }

  return [fetching, setFetching, setHasMore];
}

export default useInfiniteScroll;
