import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { LinkIcon } from "lucide-react";
import { UrlState } from "../context";
import { BarLoader } from "react-spinners";
import useFetch from "../hooks/use-fetch";
import { logout } from "../db/apiAuth";


const Header = () => {
    const {loading, fn:fnLogout} = useFetch(logout);
    const navigate = useNavigate();
    const {user,fetchUser} = UrlState();

    const initials = (user?.user_metadata?.name || "").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "U";
    const avatarSrc = user?.user_metadata?.profile_pic || user?.user_metadata?.avatar_url || null;

    return (
        <>
        
        <nav className="py-4 flex justify-between items-center">
            <Link to='/'>
                <img src="/download.png" alt="ClipURL" className="h-20 rounded-lg"  />
            </Link>

            <div>
                {!user? 
                    <Button onClick={() => navigate("/auth")} >Login</Button>
                    : (
                        <DropdownMenu>
                        <DropdownMenuTrigger><Avatar>
                            <AvatarImage src={avatarSrc} onError={(e)=>{ e.currentTarget.src=''; }} className="object-contain" />
                            <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to="/dashboard" className="flex ">
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    My Links
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400">
                                <LogOut className="mr-2 h-4 w-2" />
                                <span 
                                    onClick={()=>{
                                        fnLogout().then(()=>{
                                            fetchUser();
                                            navigate("/");
                                        });
                                    }}
                                >Logout</span> 
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    )}
            </div>
            </nav>
            {loading && <BarLoader className="mb-4" width={"100%"} color="#68706eff" />}
        </>
    );
};

export default Header;
