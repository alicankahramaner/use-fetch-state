import { useCallback, useEffect, useRef, useState } from "react";

export type UseFetchStateProps<Req, Res> = {
    fetcher: (request: Req) => Promise<Res | false>,
    initialResponse: Res;
    initialRequest: Req;
    waitCallback?: boolean;
    reFetchChangeRequest?: boolean;
}

export const useFetchState = function <Request, Response>(options: UseFetchStateProps<Request, Response>) {
    const isMounted = useRef(true);
    const fetchCountRef = useRef(0);
    const optionsRef = useRef(options);

    // update options ref on change
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const [request, setRequest] = useState(options.initialRequest);
    const [response, setResponse] = useState(options.initialResponse);
    const [loading, setLoading] = useState(!options.waitCallback);
    const [error, setError] = useState<Error | null>(null);

    // Unmount condition
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const fetchData = useCallback(async () => {

        const fetchCount = ++fetchCountRef.current;

        setError(null);
        setLoading(true);

        try {
            const result = await optionsRef.current.fetcher(request);

            // continue if fetchCount is same as refetch count and component is mounted
            if (isMounted.current && fetchCount === fetchCountRef.current) {
                if (result === false) {
                    setError(new Error("Fetch failed"));
                } else {
                    setResponse(result);
                }
            }
        } catch (err) {
            if (isMounted.current && fetchCount === fetchCountRef.current) {
                setError(err as Error);
            }
        } finally {
            if (isMounted.current && fetchCount === fetchCountRef.current) {
                setLoading(false);
            }
        }
    }, [request]);

    useEffect(() => {
        if (!options.reFetchChangeRequest) return;
        fetchData();
    }, [request, options.reFetchChangeRequest, fetchData]);

    const clear = useCallback(() => {
        setError(null);
        setLoading(false);
        setRequest(optionsRef.current.initialRequest);
        setResponse(optionsRef.current.initialResponse);
    }, []);

    useEffect(() => {
        if (!options.waitCallback) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        setRequest,
        loading,
        response,
        error,
        request,
        fetchData,
        clear
    };
}