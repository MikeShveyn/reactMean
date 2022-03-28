import {useCallback, useRef, useState, useEffect} from "react";


export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (
        url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true)

        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortController.signal
            })

            const data = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                req =>  req !== httpAbortController
            );

            if(!response.ok) { // 400 or 500 code
                throw new Error(data.message)
            }
            setIsLoading(false)
            return data;
        }catch (e) {
            setError(e.message);
            setIsLoading(false)
            throw e;
        }

    }, [])

    const clearError = () => {
        setError(null)
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        };
    }, [])

    return {isLoading, error, sendRequest, clearError}
}