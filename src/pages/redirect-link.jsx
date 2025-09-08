import { useParams } from "react-router-dom";
import useFetch from "../hooks/use-fetch";
import { getLongUrl } from "../db/apiUrls";
import { addClick } from "../db/apiClicks";
import { useEffect } from "react";

const RedirectLink = () => {

    const {id} = useParams();
    const {loading, data, fn} = useFetch(getLongUrl, id);
    const { fn: fnAddClick } = useFetch(addClick, data?.id);

    useEffect(() => {
        fn();
    },[]);

    useEffect(() => {
        if (data && data.original_url) {
            // Record the click, then redirect regardless of success
            Promise.resolve(fnAddClick())
                .catch(() => {})
                .finally(() => {
                    window.location.replace(data.original_url);
                });
        }
    }, [data]);

    return (
        <div>Redirecting...</div>
    );
};

export default RedirectLink;
