import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
    const [long_url, setLongUrl] = useState("");
    const navigate=useNavigate();

    const handleShorten=(e) =>{
        
        e.preventDefault();
        if(long_url) navigate(`/auth?createNew=${encodeURIComponent(long_url)}`);
    }

    return (
        <div className="flex flex-col items-center ">
           <h2 className="my-2 sm:my-5 text-3xl sm:text-6xl lg:text-7xl font-extrabold text-white text-center">
           The only URL shortener <br/> you will ever need 👇🏼</h2>
           <form onSubmit={handleShorten} 
           className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2">
            <Input type="url" 
            value={long_url}
            placeholder="Enter your loooooong URL"
            onChange={(e)=> setLongUrl(e.target.value)}
            className="h-full flex-1 py-1 px-4" />
            <Button className="h-full" type="submit" variant="">Shorten</Button>
           </form>
           <img src="/banner.png" alt="banner" className="h-60 w-full my-11 md:px-11" />
        </div>
    );
};

export default LandingPage;
