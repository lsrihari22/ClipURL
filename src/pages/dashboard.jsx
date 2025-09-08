import { BarLoader } from "react-spinners";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { UrlState } from "../context";
import useFetch from "../hooks/use-fetch";
import { getUrls } from "../db/apiUrls";
import { getClicks } from "../db/apiClicks";
import Error from "../components/error";
import { Link } from "react-router-dom";    
import LinkCard from "../components/LinkCard";
import CreateLink from "../components/create-link";


const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const {user} = UrlState();
    const {loading, error, data:urls, fn:fnUrls } = useFetch(getUrls, user?.id);
    const { loading: loadingClicks, data:clicks, fn:fnClicks} = useFetch(getClicks, urls?.map((url) => url.id));

    useEffect(() => {
        fnUrls();
    },[]);

    useEffect(() => {
        fnClicks();
    }, [urls?.length]);

    const filteredUrls = urls?.filter(url => 
        url.title.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
    
    return (
        <div className="flex flex-col gap-8">
            { loading || loadingClicks && <BarLoader width={"100%"} color="#36d7b7" />}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                <CardHeader>
                    <CardTitle>Links Created</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{urls?.length}</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{clicks?.length}</p>
                </CardContent>
                </Card>
            </div>
                
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-extrabold">My Links</h1>
                <CreateLink />
                
            </div>

            <div className="relative">
                <Input
                    type="text" placeholder="Search your links..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {error && <Error message={error?.message} />}
            {(filteredUrls || []).map((url,i)=>{
                return <LinkCard key={i} url={url} fetchUrl={fnUrls} />
            })}

        </div>
        
    );
};

export default Dashboard;