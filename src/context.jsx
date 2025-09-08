import { createContext, useContext, useEffect } from "react";
import { getCurrentUser } from "./db/apiAuth"
import useFetch from "./hooks/use-fetch";

const defaultContext = {
  user: null,
  loading: false,
  isAuthenticated: false,
  fetchUser: () => {},
};
const UrlContext = createContext(defaultContext);

const UrlProvider = ({ children }) => {
    const {data:user, loading, fn:fetchuser} = useFetch(getCurrentUser);
    const isAuthenticated = user?.role === "authenticated";

    useEffect(() => {
        fetchuser();
    }, []);
    // console.log("UrlProvider user:", user);
    return <UrlContext.Provider value={{ user, loading, isAuthenticated, fetchUser: fetchuser }}>
        {children}
    </UrlContext.Provider>
}

export const UrlState = () => {
    return useContext(UrlContext) || defaultContext;
}

export default UrlProvider;
