import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./error";
import { useState } from "react";
import * as Yup from "yup";
import { login } from "../db/apiAuth";
import useFetch from "../hooks/use-fetch";
import { useEffect } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import { UrlState } from "../context";


const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password:""
    });
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    let [SearchParams] = useSearchParams();
    const longLink = SearchParams.get("createNew");

    const handleInputChange= (e) =>{
        const{name,value}=e.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value,
        }));
    }

    const {data,error,loading, fn:fnLogin}= useFetch(login, formData);
    const {fetchUser} = UrlState();
    useEffect(() => {
        if(error === null && data){
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`);   
            fetchUser();
        }
    },[data, error]);

    const handleLogin=async ()=>{
        setErrors([]);
        try{
            const schema = Yup.object().shape({
                email:Yup.string().email("Invalid Email").required("Email is required"),
                password:Yup.string().min(6,"Password must be at least 6 characters").required("Password is required"),
            });
            await schema.validate(formData, { abortEarly: false });
            await fnLogin();
        }catch(e){
            const newErrors={};
            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }   
    }

    return (
        <Card>
        <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>to your account if you already have one</CardDescription>
           {error && <Error message={error.message} />}
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="space-y-1">
            <Input name="email" type="email" placeholder="Enter Email" className="w-full" onChange={handleInputChange}/>
            {errors.email && <Error message={errors.email} />}
            </div>
            <div className="space-y-1">
            <Input name="password" type="password" placeholder="Enter password" className="w-full" onChange={handleInputChange}/>
            {errors.password && <Error message={errors.password} />}
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleLogin} className="w-full" variant="outline">
            {loading? <BeatLoader size={10} color="blue" /> : "Login"}
            </Button>
        </CardFooter>
        </Card>
    );
};

export default Login;
