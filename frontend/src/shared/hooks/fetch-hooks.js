import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const activeHttpRequests = useRef([]);

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  const clearError = () => {
    setHasError(null);
  };

  const sendRequest = useCallback(
    async (
      url,
      request = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: null,
      }
    ) => {
      try {
        // console.log(url, request);
        setIsLoading(true);

        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        const response = await fetch(url, request);
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );
        // console.log(responseData);
        if (!response.ok) {
          setHasError(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setHasError(err.message);
        setIsLoading(false);
      }
    },
    []
  );

  return [isLoading, hasError, sendRequest, clearError];
};
