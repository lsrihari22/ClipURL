import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { UrlState } from "../context";

function RequireAuth({children}){
    const navigate = useNavigate();
    const {isAuthenticated, loading} = UrlState();

    useEffect(() =>{
        if(!isAuthenticated && !loading){
            navigate("/auth");
        }
    },[isAuthenticated, loading]);

    if(loading) return <BarLoader width={"100%"} color="#36d7b7" />;
    return isAuthenticated ? children : null;
}

export default RequireAuth;