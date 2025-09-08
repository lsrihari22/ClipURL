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
import { signup } from "../db/apiAuth";
import useFetch from "../hooks/use-fetch";
import { useEffect } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import { UrlState } from "../context";


const Signup = () => {
    const [formData, setFormData] = useState({
        email: "",
        password:"",
        name: "",
        profile_pic: null
    });
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    let [SearchParams] = useSearchParams();
    const longLink = SearchParams.get("createNew");

    const handleInputChange= (e) =>{
        const{name,value,files}=e.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: files ? files[0] : value,
        }));
    }

    const {data,error,loading, fn:fnSignup}= useFetch(signup, formData);
    const {fetchUser} = UrlState();
    useEffect(() => {
        if(error == null && data){
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`);   
            fetchUser();
        }
    },[ error,loading]);

    const handleSignup=async ()=>{
        setErrors([]);
        try{
            const schema = Yup.object().shape({
                name:Yup.string().required("Name is required"),
                email:Yup.string().email("Invalid Email").required("Email is required"),
                password:Yup.string().min(6,"Password must be at least 6 characters").required("Password is required"),
                profile_pic:Yup.mixed().required("Profile picture is required")
            });
            await schema.validate(formData, { abortEarly: false });
            await fnSignup();
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
            <CardTitle>Signup</CardTitle>
            <CardDescription>create a new account if you haven't already</CardDescription>
           {error && <Error message={error.message} />}
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="space-y-1">
            <Input name="name" type="text" placeholder="Enter Name" className="w-full" onChange={handleInputChange}/>
            {errors.name && <Error message={errors.name} />}
            </div>
            <div className="space-y-1">
            <Input name="email" type="email" placeholder="Enter Email" className="w-full" onChange={handleInputChange}/>
            {errors.email && <Error message={errors.email} />}
            </div>
            <div className="space-y-1">
            <Input name="password" type="password" placeholder="Enter password" className="w-full" onChange={handleInputChange}/>
            {errors.password && <Error message={errors.password} />}
            </div>
            <div className="space-y-1">
            <Input name="profile_pic" type="file" accept="image/*"  onChange={handleInputChange}/>
            {errors.profile_pic && <Error message={errors.profile_pic} />}
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSignup} className="w-full" variant="outline">
            {loading? <BeatLoader size={10} color="blue" /> : "Create Account"}
            </Button>
        </CardFooter>
        </Card>
    );
};

export default Signup;
