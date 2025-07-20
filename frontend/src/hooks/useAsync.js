import { useCallback, useEffect, useState } from 'react';

export const useAsync = (fn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await fn();
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, setData, loading, error, refresh: run };
};
