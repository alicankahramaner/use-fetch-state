import { useCallback, useEffect, useState } from "react";

export type UseFetchStateProps<Req, Res> = {
    fetcher: (request: Req) => Promise<Res | false>,
    initialResponse: Res;
    initialRequest: Req;
    waitCallback?: boolean;
    reFetchChangeRequest?: boolean;
}

export const useFetchState = function <Request, Response>(options: UseFetchStateProps<Request, Response>) {

    const [request, setRequest] = useState(options.initialRequest);
    const [response, setResponse] = useState(options.initialResponse);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setError(null);
        setLoading(true)
        try {
            const response = await options.fetcher(request)

            if (response === false) {
                setError(new Error("Fetch failed"));
            } else {
                setResponse(response);
            }

        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setResponse, options, request]);

    useEffect(() => {
        if (!options.reFetchChangeRequest) return;
        fetchData();
    }, [request, fetchData]);

    const clear = useCallback(() => {
        setError(null);
        setLoading(false);
        setRequest(options.initialRequest);
        setResponse(options.initialResponse);
    }, [setError, setLoading, setRequest, setResponse, options]);

    useEffect(() => {
        if (!options.waitCallback) {
            fetchData();
        }
        return () => {
            clear();
        };
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